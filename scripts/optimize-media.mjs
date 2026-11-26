#!/usr/bin/env node
// Optimise les images du site : redimensionnement + conversion en WebP.
//
//   npm run optimize:media
//
// Déposer les nouvelles photos (PNG / JPG) dans le dossier src/assets/... concerné, puis lancer
// la commande. Chaque image est remplacée par un .webp à la bonne taille ; l'original est
// déplacé dans media-originals/ (ignoré par git) pour ne jamais perdre la version haute définition.
// Le script est idempotent : une image déjà convertie n'est pas retraitée.
//
// Il prépare aussi des versions réduites de chaque photo (sous-dossiers w400/, w560/…) et note la
// taille des photos entières dans src/assets/images/sizes.json : le site les propose au navigateur
// (srcset), qui télécharge la plus légère restant nette sur l'écran du visiteur.

import sharp from 'sharp';
import { mkdir, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGINALS = path.join(ROOT, 'media-originals');
const SOURCE_EXT = /\.(png|jpe?g)$/i;
// Les "-small" sont des miniatures floues de 20 px (effet blur-up) : on n'y touche pas
const PLACEHOLDER = /-small\.[a-z]+$/i;

// Taille max = taille d'affichage × ~2,5 pour rester net sur les écrans haute densité.
// variants = largeurs des versions réduites (téléphones, écrans d'ordinateur standards).
const GROUPS = [
    // flashs, cartes de 154 à 320 px de large selon l'écran
    { dir: 'src/assets/images/tattoo', width: 800, height: 1000, quality: 80, variants: [400, 560] },
    // dos de carte + réalisations, mêmes dimensions
    { dir: 'src/assets/images/tattoo/done', width: 1080, height: 1350, quality: 78, variants: [400, 560, 800] },
    // cellules bento pleine hauteur, de ~500 à ~1300 px selon l'écran et les proportions
    { dir: 'src/assets/images/makeup', width: 1600, height: 2000, quality: 80, variants: [640, 960, 1280] },
    // couverture 700×320 + fonds de cartes CSS (background-image : pas de srcset possible)
    { dir: 'src/assets/images/news', width: 1600, height: 1600, quality: 75 },
    {
        // Fonds de page (background-size: cover). Ajouter ici tout nouveau fond utilisé en CSS.
        dir: 'src/assets/images',
        only: ['armure.jpg', 'black_silk.jpg', 'burgundy_textured_background.jpg', 'old_book_fable.jpg', 'old_phone.jpg'],
        width: 2400, height: 2400, quality: 72,
    },
];

const mb = (bytes) => `${(bytes / 1048576).toFixed(2)} Mo`;
const IMAGES = path.join(ROOT, 'src/assets/images');
const SIZES_FILE = path.join(IMAGES, 'sizes.json');
const VARIANT_DIR = /^w(\d+)$/;
// Une version réduite à plus de 85 % de la largeur d'origine ne ferait presque rien gagner
const usefulVariant = (variantWidth, width) => variantWidth <= width * 0.85;

async function optimize(file, { width, height, quality }) {
    const out = file.replace(SOURCE_EXT, '.webp');
    const meta = await sharp(file).metadata();

    let pipeline = sharp(file)
        .autoOrient() // applique l'orientation EXIF (photos de téléphone) avant de la supprimer
        .resize({ width, height, fit: 'inside', withoutEnlargement: true });

    // Beaucoup de PNG ont un canal alpha entièrement opaque : inutile de le garder
    if (meta.hasAlpha && (await sharp(file).stats()).isOpaque) {
        pipeline = pipeline.removeAlpha();
    }

    await pipeline.webp({ quality, effort: 6, smartSubsample: true }).toFile(out);
    return out;
}

const exists = (file) => stat(file).then(() => true, () => false);

// Versions réduites de chaque WebP du groupe (dir/w400/nom.webp…) et taille des photos entières.
// `fresh` = WebP créés à l'instant : leurs versions réduites sont refaites même si elles existent.
async function buildVariants(group, fresh, sizes) {
    const dir = path.join(ROOT, group.dir);
    const entries = await readdir(dir, { withFileTypes: true });
    const photos = entries.filter((e) => e.isFile() && e.name.endsWith('.webp')).map((e) => e.name);
    let created = 0;

    for (const name of photos) {
        const file = path.join(dir, name);
        const { width, height } = await sharp(file).metadata();
        sizes[path.relative(IMAGES, file).split(path.sep).join('/')] = [width, height];

        for (const variantWidth of group.variants.filter((w) => usefulVariant(w, width))) {
            const out = path.join(dir, `w${variantWidth}`, name);
            if (!fresh.has(file) && (await exists(out))) continue;
            await mkdir(path.dirname(out), { recursive: true });
            await sharp(file).resize({ width: variantWidth }).webp({ quality: group.quality, effort: 6, smartSubsample: true }).toFile(out);
            created += 1;
        }
    }

    // Versions orphelines : photo supprimée, ou largeur retirée de `variants`
    for (const sub of entries.filter((e) => e.isDirectory() && VARIANT_DIR.test(e.name))) {
        const variantWidth = Number(VARIANT_DIR.exec(sub.name)[1]);
        for (const name of await readdir(path.join(dir, sub.name))) {
            const size = sizes[path.relative(IMAGES, path.join(dir, name)).split(path.sep).join('/')];
            if (!size || !group.variants.includes(variantWidth) || !usefulVariant(variantWidth, size[0])) {
                await rm(path.join(dir, sub.name, name));
            }
        }
    }
    return created;
}

async function main() {
    let before = 0;
    let after = 0;
    let count = 0;
    const fresh = new Set();

    for (const group of GROUPS) {
        const dir = path.join(ROOT, group.dir);
        const entries = await readdir(dir, { withFileTypes: true });
        const files = entries
            .filter((e) => e.isFile() && SOURCE_EXT.test(e.name) && !PLACEHOLDER.test(e.name))
            .filter((e) => !group.only || group.only.includes(e.name))
            .map((e) => path.join(dir, e.name));

        // Séquentiel volontairement : sharp (effort 6) sature déjà le CPU, et chaque original
        // n'est archivé qu'une fois son WebP écrit
        for (const file of files) {
            const rel = path.relative(ROOT, file);
            const inSize = (await stat(file)).size;
            const out = await optimize(file, group);
            const outSize = (await stat(out)).size;
            fresh.add(out);

            const archived = path.join(ORIGINALS, rel);
            await mkdir(path.dirname(archived), { recursive: true });
            await rename(file, archived);

            before += inSize;
            after += outSize;
            count += 1;
            console.log(`${mb(inSize).padStart(10)} → ${mb(outSize).padStart(9)}  ${path.relative(ROOT, out)}`);
        }
    }

    if (count === 0) {
        console.log('Aucune nouvelle image à optimiser.');
    } else {
        console.log(`\n${count} image(s) : ${mb(before)} → ${mb(after)} (originaux dans media-originals/)`);
    }

    const sizes = {};
    let variants = 0;
    for (const group of GROUPS.filter((g) => g.variants)) {
        variants += await buildVariants(group, fresh, sizes);
    }
    const sorted = Object.fromEntries(Object.entries(sizes).sort(([a], [b]) => (a < b ? -1 : 1)));
    const lines = Object.entries(sorted).map(([key, size]) => `  ${JSON.stringify(key)}: ${JSON.stringify(size)}`);
    await writeFile(SIZES_FILE, `{\n${lines.join(',\n')}\n}\n`);
    console.log(`${variants} version(s) réduite(s) créée(s), tailles dans ${path.relative(ROOT, SIZES_FILE)}`);
}

await main();

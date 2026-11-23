#!/usr/bin/env node
// Optimise les images du site : redimensionnement + conversion en WebP.
//
//   npm run optimize:media
//
// Déposer les nouvelles photos (PNG / JPG) dans le dossier src/assets/... concerné, puis lancer
// la commande. Chaque image est remplacée par un .webp à la bonne taille ; l'original est
// déplacé dans media-originals/ (ignoré par git) pour ne jamais perdre la version haute définition.
// Le script est idempotent : une image déjà convertie n'est pas retraitée.

import sharp from 'sharp';
import { mkdir, readdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGINALS = path.join(ROOT, 'media-originals');
const SOURCE_EXT = /\.(png|jpe?g)$/i;
// Les "-small" sont des miniatures floues de 20 px (effet blur-up) : on n'y touche pas
const PLACEHOLDER = /-small\.[a-z]+$/i;

// Taille max = taille d'affichage × ~2,5 pour rester net sur les écrans haute densité
const GROUPS = [
    { dir: 'src/assets/images/tattoo', width: 800, height: 1000, quality: 80 },       // flashs, cartes 320×384
    { dir: 'src/assets/images/tattoo/done', width: 1080, height: 1350, quality: 78 }, // dos de carte + réalisations
    { dir: 'src/assets/images/makeup', width: 1600, height: 2000, quality: 80 },      // cellules bento ~600×970
    { dir: 'src/assets/images/news', width: 1600, height: 1600, quality: 75 },        // couverture 700×320 + cartes
    {
        // Fonds de page (background-size: cover). Ajouter ici tout nouveau fond utilisé en CSS.
        dir: 'src/assets/images',
        only: ['armure.jpg', 'black_silk.jpg', 'burgundy_textured_background.jpg', 'old_book_fable.jpg', 'old_phone.jpg'],
        width: 2400, height: 2400, quality: 72,
    },
];

const mb = (bytes) => `${(bytes / 1048576).toFixed(2)} Mo`;

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

async function main() {
    let before = 0;
    let after = 0;
    let count = 0;

    for (const group of GROUPS) {
        const dir = path.join(ROOT, group.dir);
        const entries = await readdir(dir, { withFileTypes: true });
        const files = entries
            .filter((e) => e.isFile() && SOURCE_EXT.test(e.name) && !PLACEHOLDER.test(e.name))
            .filter((e) => !group.only || group.only.includes(e.name))
            .map((e) => path.join(dir, e.name));

        for (const file of files) {
            const rel = path.relative(ROOT, file);
            const inSize = (await stat(file)).size;
            const out = await optimize(file, group);
            const outSize = (await stat(out)).size;

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
        return;
    }
    console.log(`\n${count} image(s) : ${mb(before)} → ${mb(after)} (originaux dans media-originals/)`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

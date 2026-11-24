#!/usr/bin/env node
// Allège les fichiers 3D de l'accueil, sans changer le rendu. À relancer seulement si le modèle
// ou l'éclairage change.
//
//   npm run optimize:3d
//
// Les sources restent hors de git, dans media-originals/ :
//   - models/tattoo_machine/scene-v2.glb : le modèle Sketchfab d'origine, à récupérer au besoin (Git Bash) avec
//     git show 265d758:public/models/tattoo_machine/scene-v2.glb > media-originals/models/tattoo_machine/scene-v2.glb
//   - hdri/studio_small_03_1k.hdr : l'éclairage « studio » de Poly Haven (CC0), celui qu'utilisait
//     drei, sur https://polyhaven.com/a/studio_small_03

import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, draco, flatten, join, prune } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import { FloatType } from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGINALS = path.join(ROOT, 'media-originals');

const MODEL = { from: 'models/tattoo_machine/scene-v2.glb', to: 'public/models/tattoo_machine/scene-v3.glb' };
// Les reflets passent par un flou (PMREM) : 256 × 128 px rendent comme l'original en 1024 × 512
const ENVIRONMENT = { from: 'hdri/studio_small_03_1k.hdr', to: 'public/hdri/studio_small_03_256.hdr', factor: 4 };

const kb = (bytes) => `${Math.round(bytes / 1024)} Ko`;

async function optimizeModel(input, output) {
    const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
        'draco3d.decoder': await draco3d.createDecoderModule(),
        'draco3d.encoder': await draco3d.createEncoderModule(),
    });
    const document = await io.read(input);

    // Le modèle n'a aucune texture : ses deux jeux de coordonnées UV ne servent à rien
    for (const primitive of document.getRoot().listMeshes().flatMap((mesh) => mesh.listPrimitives())) {
        primitive.setAttribute('TEXCOORD_0', null);
        primitive.setAttribute('TEXCOORD_1', null);
    }

    // Un maillage par matériau (4 appels de dessin au lieu de 24), puis recompression Draco.
    // Pas de simplification : le moletage du grip et son contour noir perdraient leur dessin.
    await document.transform(prune(), dedup(), flatten(), join({ keepNamed: false }), draco());
    await io.write(output, document);
}

// RGBE : les trois canaux partagent un exposant (frexp du plus grand), chacun garde 8 bits de mantisse
function toRgbe(r, g, b) {
    const max = Math.max(r, g, b);
    if (max < 1e-32) return [0, 0, 0, 0];
    let exponent = Math.floor(Math.log2(max)) + 1;
    if (max / 2 ** exponent >= 1) exponent += 1; // arrondi de log2 juste sous une puissance de 2
    const scale = 256 / 2 ** exponent;
    return [r, g, b].map((c) => Math.min(255, Math.floor(c * scale))).concat(exponent + 128);
}

// Compression RLE de Radiance, canal par canal : séries d'octets identiques ou suites brutes
function encodeChannel(values, bytes) {
    let i = 0;
    while (i < values.length) {
        let run = 1;
        while (i + run < values.length && run < 127 && values[i + run] === values[i]) run += 1;
        if (run >= 3) {
            bytes.push(128 + run, values[i]);
            i += run;
            continue;
        }
        const start = i;
        while (i < values.length && i - start < 128) {
            if (i + 2 < values.length && values[i] === values[i + 1] && values[i] === values[i + 2]) break;
            i += 1;
        }
        bytes.push(i - start, ...values.subarray(start, i));
    }
}

// Réduit une image .hdr par moyenne de blocs factor × factor
async function shrinkHdr(input, output, factor) {
    const file = await readFile(input);
    const { width, height, data } = new RGBELoader()
        .setDataType(FloatType)
        .parse(file.buffer.slice(file.byteOffset, file.byteOffset + file.length));
    const w = width / factor;
    const h = height / factor;

    const chunks = [Buffer.from(`#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n-Y ${h} +X ${w}\n`, 'ascii')];
    for (let y = 0; y < h; y++) {
        const channels = Array.from({ length: 4 }, () => new Uint8Array(w));
        for (let x = 0; x < w; x++) {
            const rgb = [0, 1, 2].map((c) => {
                let sum = 0;
                for (let dy = 0; dy < factor; dy++) {
                    for (let dx = 0; dx < factor; dx++) sum += data[((y * factor + dy) * width + x * factor + dx) * 4 + c];
                }
                return sum / factor ** 2;
            });
            toRgbe(...rgb).forEach((value, c) => { channels[c][x] = value; });
        }
        const bytes = [2, 2, w >> 8, w & 255];
        channels.forEach((channel) => encodeChannel(channel, bytes));
        chunks.push(Buffer.from(bytes));
    }
    await writeFile(output, Buffer.concat(chunks));
}

async function run({ from, to }, task) {
    const input = path.join(ORIGINALS, from);
    const output = path.join(ROOT, to);
    try {
        await stat(input);
    } catch {
        console.error(`Source absente : media-originals/${from} (voir l'en-tête du script)`);
        process.exitCode = 1;
        return;
    }
    await mkdir(path.dirname(output), { recursive: true });
    await task(input, output);
    console.log(`${kb((await stat(input)).size).padStart(9)} → ${kb((await stat(output)).size).padStart(8)}  ${to}`);
}

await run(MODEL, optimizeModel);
await run(ENVIRONMENT, (input, output) => shrinkHdr(input, output, ENVIRONMENT.factor));

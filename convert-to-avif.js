// =============================================================
//  CONVERTIDOR DE IMAGENES A AVIF - Diapositive Studios
// =============================================================
//
//  COMO USAR:
//  1. Agrega tus imagenes nuevas (jpg/png) en las carpetas de img/
//  2. Abre la terminal en esta carpeta
//  3. Ejecuta:  node convert-to-avif.js
//  4. Listo! Las imagenes .avif se crean al lado de las originales
//
//  NOTA: El HTML ya apunta a .avif, asi que solo necesitas
//  que el archivo .avif exista con el mismo nombre.
//  Ejemplo: img/coedh/1.jpg -> img/coedh/1.avif
//
// =============================================================

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'img');

async function convertAll() {
    var totalOriginal = 0;
    var totalAvif = 0;
    var count = 0;
    var skipped = 0;

    // Busca automaticamente TODAS las carpetas dentro de img/
    var folders = fs.readdirSync(imgDir).filter(function(f) {
        return fs.statSync(path.join(imgDir, f)).isDirectory();
    });

    console.log('Carpetas encontradas: ' + folders.join(', '));
    console.log('----------------------------------------\n');

    for (var i = 0; i < folders.length; i++) {
        var folder = folders[i];
        var folderPath = path.join(imgDir, folder);
        var files = fs.readdirSync(folderPath);

        for (var j = 0; j < files.length; j++) {
            var file = files[j];
            var ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png'].indexOf(ext) === -1) continue;

            var inputPath = path.join(folderPath, file);
            var baseName = path.basename(file, path.extname(file));
            var outputPath = path.join(folderPath, baseName + '.avif');

            // Si ya existe el .avif y es mas reciente que el original, saltar
            if (fs.existsSync(outputPath)) {
                var origTime = fs.statSync(inputPath).mtimeMs;
                var avifTime = fs.statSync(outputPath).mtimeMs;
                if (avifTime > origTime) {
                    skipped++;
                    continue;
                }
            }

            var originalSize = fs.statSync(inputPath).size;

            try {
                await sharp(inputPath)
                    .avif({ quality: 65, effort: 4 })
                    .toFile(outputPath);

                var avifSize = fs.statSync(outputPath).size;
                var savings = ((1 - avifSize / originalSize) * 100).toFixed(1);

                totalOriginal += originalSize;
                totalAvif += avifSize;
                count++;

                console.log('[OK] ' + folder + '/' + file + ' -> ' + baseName + '.avif | ' + (originalSize/1024).toFixed(0) + 'KB -> ' + (avifSize/1024).toFixed(0) + 'KB (' + savings + '% mas liviano)');
            } catch (err) {
                console.log('[ERROR] ' + folder + '/' + file + ': ' + err.message);
            }
        }
    }

    console.log('\n========================================');
    console.log('Convertidas: ' + count + ' imagenes nuevas');
    console.log('Saltadas: ' + skipped + ' (ya estaban al dia)');
    if (count > 0) {
        console.log('Original: ' + (totalOriginal/1024/1024).toFixed(2) + ' MB');
        console.log('AVIF: ' + (totalAvif/1024/1024).toFixed(2) + ' MB');
        console.log('Ahorro: ' + ((1 - totalAvif/totalOriginal) * 100).toFixed(1) + '%');
    }
    console.log('========================================');
}

convertAll();

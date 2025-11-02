const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
    const inputPath = path.join(__dirname, '../public/icon.png');
    const outputDir = path.join(__dirname, '../public');

    // Check if icon.png exists
    if (!fs.existsSync(inputPath)) {
        console.error('Error: icon.png not found in public folder');
        console.log('Please ensure icon.png exists in the public folder');
        process.exit(1);
    }

    const sizes = [192, 384, 512];

    console.log('Generating PWA icons...');

    try {
        for (const size of sizes) {
            const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
            await sharp(inputPath)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 139, g: 92, b: 246, alpha: 1 } // Purple theme color
                })
                .png()
                .toFile(outputPath);
            console.log(`✓ Created icon-${size}x${size}.png`);
        }
        console.log('\n✅ All icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error.message);
        process.exit(1);
    }
}

generateIcons();

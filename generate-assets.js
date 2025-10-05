const fs = require('fs');
const path = require('path');

// Créer le dossier assets s'il n'existe pas
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

console.log('✓ Dossier assets créé');
console.log('\n⚠️  IMPORTANT: Vous devez créer les images suivantes dans le dossier assets/ :');
console.log('  - icon.png (1024x1024)');
console.log('  - splash.png (1242x2436)');
console.log('  - adaptive-icon.png (1024x1024)');
console.log('  - notification-icon.png (96x96)');
console.log('\nVous pouvez utiliser https://www.canva.com ou un autre outil pour créer ces images.');
console.log('Ou utilisez la commande: npx expo-asset-utils');

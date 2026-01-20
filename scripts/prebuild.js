const fs = require('fs');
const path = require('path');

const metadataPath = path.join(__dirname, '..', 'src', 'metadata.ts');

// Verificar si el archivo metadata.ts existe
if (!fs.existsSync(metadataPath)) {
  // Crear el archivo con el contenido predeterminado
  const content = 'export default async () => ({});\n';

  try {
    fs.writeFileSync(metadataPath, content, 'utf8');
    console.log('✅ metadata.ts creado exitosamente');
  } catch (error) {
    console.error('❌ Error al crear metadata.ts:', error.message);
    process.exit(1);
  }
} else {
  console.log('ℹ️  metadata.ts ya existe, omitiendo creación');
}

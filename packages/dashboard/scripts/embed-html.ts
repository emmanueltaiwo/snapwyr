import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const uiDistPath = join(rootDir, 'dist', 'ui', 'index.html');
const outputPath = join(rootDir, 'server', 'html.ts');
const faviconPath = join(rootDir, 'public', 'favicon.png');

function embedHtml() {
  if (!existsSync(uiDistPath)) {
    console.log('⚠️  UI build not found. Using placeholder HTML.');
    console.log('   Run `npm run build:ui` first to build the full dashboard.');
    return;
  }

  let html = readFileSync(uiDistPath, 'utf-8');

  // Convert favicon to data URI if it exists
  if (existsSync(faviconPath)) {
    const faviconBuffer = readFileSync(faviconPath);
    const faviconBase64 = faviconBuffer.toString('base64');
    const faviconDataUri = `data:image/png;base64,${faviconBase64}`;

    // Replace favicon link with data URI
    html = html.replace(
      /<link\s+rel=["']icon["'][^>]*>/i,
      `<link rel="icon" type="image/png" href="${faviconDataUri}" />`
    );
  }

  const escapedHtml = html
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

  const output = `// This file is auto-generated during build
// Run \`npm run build:embed\` to regenerate

export const DASHBOARD_HTML = \`${escapedHtml}\`;
`;

  writeFileSync(outputPath, output);
  console.log('✅ Dashboard HTML embedded into server/html.ts');
}

embedHtml();

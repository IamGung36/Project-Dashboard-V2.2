/**
 * Build script to compile source files (HTML, CSS, JS) into 
 * deployable Google Apps Script assets inside the /dist directory.
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

function build() {
  console.log('Starting build process...');

  // 1. Ensure dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
    console.log('Created dist/ directory.');
  }

  // 2. Copy Code.js (server code) directly
  const codeSrcPath = path.join(SRC_DIR, 'Code.js');
  const codeDistPath = path.join(DIST_DIR, 'Code.js');
  if (fs.existsSync(codeSrcPath)) {
    fs.copyFileSync(codeSrcPath, codeDistPath);
    console.log('Copied Code.js to dist/');
  } else {
    console.error('Error: src/Code.js not found!');
    process.exit(1);
  }

  // 3. Read index.html, styles.css, app.js
  const htmlPath = path.join(SRC_DIR, 'index.html');
  const cssPath = path.join(SRC_DIR, 'styles.css');
  const jsPath = path.join(SRC_DIR, 'app.js');

  if (!fs.existsSync(htmlPath) || !fs.existsSync(cssPath) || !fs.existsSync(jsPath)) {
    console.error('Error: Source frontend files (index.html, styles.css, app.js) are missing!');
    process.exit(1);
  }

  let htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  const jsContent = fs.readFileSync(jsPath, 'utf8');

  // 4. Inject CSS
  const cssTag = `<style>\n${cssContent}\n</style>`;
  htmlContent = htmlContent.replace('<!-- CSS_PLACEHOLDER -->', cssTag);
  console.log('Injected styles.css into index.html');

  // 5. Inject JS
  const jsTag = `<script>\n${jsContent}\n</script>`;
  htmlContent = htmlContent.replace('<!-- SCRIPT_PLACEHOLDER -->', jsTag);
  console.log('Injected app.js into index.html');

  // 6. Write compiled file to dist/index.html
  const htmlDistPath = path.join(DIST_DIR, 'index.html');
  fs.writeFileSync(htmlDistPath, htmlContent, 'utf8');
  console.log('Written compiled dist/index.html');

  console.log('Build completed successfully!');
}

build();

// `npm test`: builds the site into _site/ and checks the result.
// Fails if a page is missing or if a hand-written page was changed by the build.
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';

// Always a clean build: Eleventy does not remove files from _site/ whose source is gone.
rmSync('_site', { recursive: true, force: true });
execSync('npx eleventy', { stdio: 'inherit' });

const mustExist = [
  'index.html', 'style.css', 'main/main.html', 'main/main.js', 'main/styles/style.css', 'main/images/favicon.png',
  'pages.css', 'recipes/index.html', 'posts/index.html', 'art/index.html', '404.html',
];
const missing = mustExist.filter((f) => !existsSync(`_site/${f}`));
if (missing.length > 0) {
  console.error(`missing from _site: ${missing.join(', ')}`);
  process.exit(1);
}
for (const f of ['index.html', 'style.css', 'main/main.html', 'main/styles/style.css']) {
  if (readFileSync(f, 'utf8') !== readFileSync(`_site/${f}`, 'utf8')) {
    console.error(`${f} was changed by the build. Hand-written pages must be copied exactly.`);
    process.exit(1);
  }
}
console.log(`build ok: ${mustExist.length} files checked`);

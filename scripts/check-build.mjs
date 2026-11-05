// `npm test`: builds the site into _site/ and checks the result.
// Fails if a page is missing or if one of Jimena's original pages was changed by the build.
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';

// Always a clean build: Eleventy does not remove files from _site/ whose source is gone.
rmSync('_site', { recursive: true, force: true });
execSync('npx eleventy', { stdio: 'inherit' });

const mustExist = [
  'index.html', 'art/index.html', 'photography/index.html', 'about/index.html',
  'recipes/index.html', 'blog/index.html', 'projects/index.html', '404.html',
  'brief.css', 'brief.js', 'robots.txt', 'sitemap.xml',
  'main/main.html', 'main/main.js', 'main/styles/style.css', 'main/images/favicon.png',
  'main/first-webpage.html', 'main/first-webpage.css',
];
const missing = mustExist.filter((f) => !existsSync(`_site/${f}`));
if (missing.length > 0) {
  console.error(`missing from _site: ${missing.join(', ')}`);
  process.exit(1);
}
for (const f of ['main/main.html', 'main/styles/style.css', 'main/first-webpage.html', 'main/first-webpage.css']) {
  if (readFileSync(f, 'utf8') !== readFileSync(`_site/${f}`, 'utf8')) {
    console.error(`${f} was changed by the build. Her original pages must be copied exactly.`);
    process.exit(1);
  }
}
console.log(`build ok: ${mustExist.length} files checked`);

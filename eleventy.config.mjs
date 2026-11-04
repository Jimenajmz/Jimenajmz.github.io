// How the site is built. Two kinds of page live here:
//  1. Hand-written pages (index.html, everything under main/). They are copied exactly as written.
//  2. Text pages (recipes/, posts/, art/ as Markdown). Eleventy wraps each in _includes/layout.njk,
//     which uses the same stylesheet as the hand-written pages.
// `npm start` previews the site; `npm test` builds it and checks the result.
export default function (eleventyConfig) {
  // Hand-written pages and their files: copied byte for byte, no templating.
  eleventyConfig.addPassthroughCopy('index.html');
  eleventyConfig.addPassthroughCopy('index.js');
  eleventyConfig.addPassthroughCopy('style.css');
  eleventyConfig.addPassthroughCopy('pages.css');
  eleventyConfig.addPassthroughCopy('main');
  // Pictures for text pages.
  eleventyConfig.addPassthroughCopy('images');

  // One list per section. Posts and art newest first; recipes by title.
  eleventyConfig.addCollection('recipes', (api) =>
    api.getFilteredByGlob('recipes/*.md').sort((a, b) => a.data.title.localeCompare(b.data.title)));
  eleventyConfig.addCollection('posts', (api) => api.getFilteredByGlob('posts/*.md').reverse());
  eleventyConfig.addCollection('art', (api) => api.getFilteredByGlob('art/*.md').reverse());

  // "10 November 2026" from a date.
  eleventyConfig.addFilter('niceDate', (value) =>
    new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }));

  eleventyConfig.setServerOptions({ port: 8080, showAllHosts: false });

  return {
    templateFormats: ['md', 'njk'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: { input: '.', includes: '_includes', output: '_site' },
  };
}

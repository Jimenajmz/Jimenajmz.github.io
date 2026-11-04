// How the site is built. Two kinds of page live here:
//  1. Jimena's hand-written pages, everything under main/. They are copied exactly as written.
//  2. Scrapbook pages: the home page (index.njk), about.md, and recipes/, posts/, art/ as
//     Markdown. Eleventy wraps each in _includes/layout.njk, styled by scrapbook.css.
// `npm start` previews the site; `npm test` builds it and checks the result.
export default function (eleventyConfig) {
  // Hand-written pages and their files: copied byte for byte, no templating.
  eleventyConfig.addPassthroughCopy('index.js');
  eleventyConfig.addPassthroughCopy('main');
  // The scrapbook theme (stylesheet and the star rain).
  eleventyConfig.addPassthroughCopy('scrapbook.css');
  eleventyConfig.addPassthroughCopy('scrapbook.js');
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

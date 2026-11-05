// How the site is built.
//  1. Jimena's original hand-written pages live under main/ and are copied exactly as written.
//  2. Everything else is a text file (Markdown with a few front-matter fields) that Eleventy turns
//     into a page using the layouts in _includes/, styled by brief.css. See AGENTS.md.
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('index.js');
  eleventyConfig.addPassthroughCopy('main');
  eleventyConfig.addPassthroughCopy('images');
  eleventyConfig.addPassthroughCopy('brief.css');
  eleventyConfig.addPassthroughCopy('brief.js');

  const byCreatedDesc = (a, b) => (b.data.created ?? b.date) - (a.data.created ?? a.date);
  eleventyConfig.addCollection('art', (api) => api.getFilteredByGlob('art/*.md').sort(byCreatedDesc));
  eleventyConfig.addCollection('photography', (api) => api.getFilteredByGlob('photography/*.md').sort(byCreatedDesc));
  eleventyConfig.addCollection('blog', (api) => api.getFilteredByGlob('blog/*.md').reverse());
  eleventyConfig.addCollection('recipes', (api) =>
    api.getFilteredByGlob('recipes/*.md').sort((a, b) => a.data.title.localeCompare(b.data.title)));
  eleventyConfig.addCollection('projects', (api) =>
    api.getFilteredByGlob('projects/*.md').sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99)));

  eleventyConfig.addFilter('niceDate', (value) =>
    new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }));
  eleventyConfig.addFilter('year', (value) => (value ? String(new Date(value).getUTCFullYear()) : ''));
  // The tags a gallery post can be filtered by: its medium, its camera, its year, and any extra tags.
  // A camera's tag is its name without the brand: "Sony RX100 II" is tagged "RX100 II". An unknown camera gets no tag.
  const cameraBrands = /^(sony|canon|nikon|fujifilm|fuji|olympus|om system|panasonic|lumix|leica|ricoh|pentax|kodak|minolta|hasselblad|apple|google|samsung)\s+/i;
  const cameraTag = (camera) => (camera && !/^unknown/i.test(String(camera)) ? String(camera).replace(cameraBrands, '') : null);
  const tagsOf = (item) => {
    const d = item.data;
    const year = d.created ?? item.date;
    return [d.medium, cameraTag(d.camera), year ? String(new Date(year).getUTCFullYear()) : null, ...(d.tags ?? [])]
      .filter(Boolean).map((t) => String(t).toLowerCase());
  };
  eleventyConfig.addFilter('tagsOf', tagsOf);
  eleventyConfig.addFilter('tagList', (items) => [...new Set(items.flatMap(tagsOf))].sort());
  eleventyConfig.addFilter('thumb', (item) => item.data.thumbnail ?? (item.data.media ?? []).find((m) => m.src)?.src ?? '');
  eleventyConfig.addFilter('inCategory', (items, category) => items.filter((r) => r.data.category === category));
  eleventyConfig.addFilter('stars', (n) => '★'.repeat(Math.max(0, Math.min(5, Number(n) || 0))) + '☆'.repeat(5 - Math.max(0, Math.min(5, Number(n) || 0))));
  eleventyConfig.addFilter('take', (items, n) => items.slice(0, n));

  eleventyConfig.setServerOptions({ port: 8080, showAllHosts: false });
  return {
    templateFormats: ['md', 'njk'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: { input: '.', includes: '_includes', output: '_site' },
  };
}

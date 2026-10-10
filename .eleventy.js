const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-MM-dd") => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(format);
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLLL yyyy");
  });

  eleventyConfig.addFilter("selectTag", function (arr, tag) {
    if (!Array.isArray(arr)) return [];
    if (!tag) return arr;
    const normalized = tag.toLowerCase();
    return arr.filter(item => {
      if (!item.data.tags) return false;
      return item.data.tags.some(t => t.toLowerCase() === normalized);
    });
  });

  eleventyConfig.addFilter("sortByDate", function (arr) {
    if (!Array.isArray(arr)) return [...arr].sort((a, b) => b.date - a.date);
    return [...arr].sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addPassthroughCopy("robots.txt");

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const tagSet = new Set();
    const tagNorm = {};
    collectionApi.getFilteredByGlob("src/posts/*.md").forEach(item => {
      (item.data.tags || []).forEach(tag => {
        if (tag === "post" || tag === "news" || tag === "moc") return;
        const slug = tag.toLowerCase().replace(/\s+/g, "-");
        tagSet.add(slug);
        if (!tagNorm[slug]) {
          tagNorm[slug] = tag.split(" ")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");
        }
      });
    });
    return [...tagSet].map(slug => ({ tag: tagNorm[slug] || slug, slug }));
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};

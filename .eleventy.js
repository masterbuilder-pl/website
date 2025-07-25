const { readdirSync } = require("fs");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-MM-dd") => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(format);
  });

  eleventyConfig.addFilter("selectLang", function(arr, lan) {
    if (!Array.isArray(arr)) return [];
    if (!lan) return arr;
    return arr.filter(item => item.data.language === lan);
  });
  eleventyConfig.addFilter("selectTag", function(arr, tag) {
    if (!Array.isArray(arr)) return [];
    if (!tag) return arr;
    return arr.filter(item => item.data.tags && item.data.tags.includes(tag));
  });

  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addCollection("posts", function (collectionApi) {
    const languages = ["pl", "en"];
    let allPosts = [];
    languages.forEach(lang => {
      const posts = collectionApi.getFilteredByGlob(`src/${lang}/posts/*.md`).map(p => {
        p.data.language = lang;
        return p;
      });
      allPosts = allPosts.concat(posts);
    });
    return allPosts.sort((a, b) => b.date - a.date);

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

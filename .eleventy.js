const { readdirSync } = require("fs");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-MM-dd") => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(format);
  });

  eleventyConfig.addFilter("selectLang", function (arr, lan) {
    if (!Array.isArray(arr)) return [];
    if (!lan) return arr;
    return arr.filter(item => item.data.language === lan);
  });
  eleventyConfig.addFilter("selectTag", function (arr, tag) {
    if (!Array.isArray(arr)) return [];
    if (!tag) return arr;
    return arr.filter(item => item.data.tags && item.data.tags.includes(tag));
  });
  eleventyConfig.addFilter("sortByDate", function (arr) {
    if (!Array.isArray(arr)) return [];
    return arr.sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addPassthroughCopy("robots.txt");
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
  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tagsByLang = {};
    // Go through each post
    collectionApi.getFilteredByTag("post").forEach(item => {
        const lang = item.data.language;
        if (item.data.tags) {
            // Create a Set for each language if it doesn't exist
            if (!tagsByLang[lang]) {
                tagsByLang[lang] = new Set();
            }
            // Add tags to the correct language set
            item.data.tags.forEach(tag => {
                // Exclude tags used for primary navigation
                if (tag !== 'post' && tag !== 'news' && tag !== 'moc') {
                    tagsByLang[lang].add(tag);
                }
            });
        }
    });

    // Create a flat list of objects like { tag: "lego", lang: "en" }
    const tagList = [];
    for (const lang in tagsByLang) {
        tagsByLang[lang].forEach(tag => {
            tagList.push({ tag, lang });
        });
    }
    return tagList;
  });
  
  // Format date for display
  eleventyConfig.addFilter("readableDate", (dateObj, lang = "en") => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).setLocale(lang).toFormat("dd LLLL yyyy");
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

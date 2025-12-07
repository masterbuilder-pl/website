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
    // Case-insensitive tag matching
    const normalizedTag = tag.toLowerCase();
    return arr.filter(item => {
      if (!item.data.tags) return false;
      return item.data.tags.some(t => t.toLowerCase() === normalizedTag);
    });
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
    const languages = ["pl", "en"];
    // Map to track normalized tag -> original tag mapping to preserve case for display
    const tagNormalization = {};
    
    // Go through each post from both languages - same approach as posts collection
    languages.forEach(lang => {
      const posts = collectionApi.getFilteredByGlob(`src/${lang}/posts/*.md`);
      posts.forEach(item => {
        // Ensure language is set
        if (!item.data.language) {
          item.data.language = lang;
        }
        const itemLang = item.data.language;
        
        if (item.data.tags) {
          // Create a Set for each language if it doesn't exist
          if (!tagsByLang[itemLang]) {
            tagsByLang[itemLang] = new Set();
          }
          // Add tags to the correct language set
          item.data.tags.forEach(tag => {
            // Exclude tags used for primary navigation
            if (tag !== 'post' && tag !== 'news' && tag !== 'moc') {
              // Normalize tag to lowercase for deduplication
              const normalizedTag = tag.toLowerCase();
              const key = `${itemLang}:${normalizedTag}`;
              
              // Store canonical tag (prefer title case version)
              if (!tagNormalization[key]) {
                // Default to title case (capitalize first letter of each word)
                tagNormalization[key] = normalizedTag.split(' ').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ');
              }
              // If we see a version with proper title case (first letter of each word is uppercase), prefer it
              const words = tag.split(' ');
              if (words.some(word => word.length > 0 && word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase())) {
                tagNormalization[key] = tag;
              }
              
              tagsByLang[itemLang].add(normalizedTag);
            }
          });
        }
      });
    });

    // Create a flat list of objects like { tag: "lego", lang: "en" }
    // Use normalized tag to avoid duplicate permalinks, but store original for display
    const tagList = [];
    for (const lang in tagsByLang) {
      tagsByLang[lang].forEach(normalizedTag => {
        const key = `${lang}:${normalizedTag}`;
        // Use the original tag name (preserving case) for display in the tagList
        // The permalink will use slugify which handles case-insensitive matching
        const displayTag = tagNormalization[key] || normalizedTag;
        tagList.push({ tag: displayTag, lang });
      });
    }
    return tagList;
  });
  
  // Format date for display
  const polishGenitiveMonths = [
    "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
    "lipca", "sierpnia", "września", "października", "listopada", "grudnia"
  ];

  // Helper to get genitive month for Polish
  function getPolishGenitiveMonth(monthIndex) {
    return polishGenitiveMonths[monthIndex - 1];
  }

  eleventyConfig.addFilter("readableDate", (dateObj, lang = "en") => {
    const dt = DateTime.fromJSDate(dateObj, { zone: 'utc' });
    if (lang === "pl") {
      // Use genitive month for Polish
      const day = dt.day;
      const month = getPolishGenitiveMonth(dt.month);
      const year = dt.year;
      return `${day} ${month} ${year}`;
    }
    return dt.setLocale(lang).toFormat("dd LLLL yyyy");
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

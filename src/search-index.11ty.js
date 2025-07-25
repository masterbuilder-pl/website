const fs = require("fs");
const matter = require("gray-matter");

module.exports = () => {
  const langs = ["pl", "en"];
  const posts = [];

  langs.forEach(lang => {
    const dir = `src/${lang}/posts`;
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(file => {
        const fullPath = `${dir}/${file}`;
        const raw = fs.readFileSync(fullPath, "utf-8");
        const { data, content } = matter(raw);
        posts.push({
          title: data.title,
          content,
          url: `/${lang}/posts/${file.replace(/\.md$/, "/")}`,
          image: data.image || null,
          lang
        });
      });
    }
  });

  return JSON.stringify(posts, null, 2);
};

module.exports.data = {
  permalink: "search-index.json"
};

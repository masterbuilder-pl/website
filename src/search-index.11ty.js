const fs = require("fs");
const matter = require("gray-matter");

module.exports = () => {
  const posts = [];
  const dir = "src/posts";
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      if (!file.endsWith(".md")) return;
      const raw = fs.readFileSync(`${dir}/${file}`, "utf-8");
      const { data, content } = matter(raw);
      posts.push({
        title: data.title || "",
        content,
        url: `/posts/${file.replace(/\.md$/, "/")}`,
        image: data.image || null,
        tags: data.tags || []
      });
    });
  }
  return JSON.stringify(posts, null, 2);
};

module.exports.data = {
  permalink: "search-index.json"
};

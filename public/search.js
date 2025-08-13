fetch('/search-index.json')
  .then(res => res.json())
  .then(docs => {
    console.log("Search index loaded:", docs);
    const idx = lunr(function () {
      this.ref('url');
      this.field('title');
      this.field('content');
      docs.forEach(doc => this.add(doc));
    });

    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");

    function stripTags(html) {
      return html.replace(/<[^>]*>/g, '');
    }

    if (query) {
      const results = idx.search(query);
      const output = document.getElementById("search-results");
      output.innerHTML = "";
      results.forEach(result => {
        const doc = docs.find(d => d.url === result.ref);
        if (doc.lang === document.documentElement.lang) {
          const div = document.createElement("div");
          div.className = "search-tile";
          div.innerHTML = `
            <a href="${doc.url}" class="search-tile-img-link" aria-label="Read more about ${doc.title}">
              <div class="search-tile-img-wrap">
                <img src="${doc.image || '/favicon.png'}" alt="${doc.title}" class="search-tile-img" />
              </div>
            </a>
            <div class="search-tile-content">
              <div class="search-tile-main">
                <h3>
                  <a href="${doc.url}" class="stretched-link-target">${doc.title}</a>
                </h3>
                <div class="post-meta">
                  <span class="post-date">${doc.date || ''}</span>
                </div>
                <p>${stripTags(doc.content).slice(0, 120)}...</p>
              </div>
              <div class="tags-container">
                ${(doc.tags || []).filter(tag => tag !== 'post' && tag !== 'news' && tag !== 'moc').map(tag => `<a href="/${doc.lang}/tags/${tag}/" class="tag">${tag}</a>`).join(' ')}
              </div>
            </div>
          `;
          output.appendChild(div);
        }
      });
    }
  });

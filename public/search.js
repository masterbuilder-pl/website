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

      results.forEach(result => {
        const doc = docs.find(d => d.url === result.ref);
        const div = document.createElement("div");
        div.className = "search-tile";
        div.innerHTML = `
          <a href="${doc.url}" class="search-tile-link">
            <div class="search-tile-img-wrap">
              <img src="${doc.image || '/favicon.png'}" alt="${doc.title}" class="search-tile-img" />
            </div>
            <div class="search-tile-content">
              <h3>${doc.title}</h3>
              <p>${stripTags(doc.content).slice(0, 120)}...</p>
            </div>
          </a>
        `;
        if (doc.lang === document.documentElement.lang) {
          output.appendChild(div);
        }
      });
    }
  });

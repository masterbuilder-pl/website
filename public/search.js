fetch('/search-index.json')
  .then(res => res.json())
  .then(docs => {
    const idx = lunr(function () {
      this.ref('url');
      this.field('title', { boost: 10 });
      this.field('content');
      docs.forEach(doc => this.add(doc));
    });

    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    const output = document.getElementById("search-results");

    if (!query) return;

    document.getElementById("search-query-display").textContent = query;

    const results = idx.search(query);
    if (!results.length) {
      output.innerHTML = '<p class="search-empty">No builds found for that search.</p>';
      return;
    }

    output.innerHTML = '<div class="masonry">' + results.map(result => {
      const doc = docs.find(d => d.url === result.ref);
      if (!doc) return "";
      const img = doc.image
        ? `<img src="${doc.image}" alt="${doc.title}" loading="lazy">`
        : `<div class="tile-no-image"></div>`;
      const tags = (doc.tags || [])
        .filter(t => t !== "post" && t !== "news")
        .map(t => `<span class="tag${t === "moc" ? "" : " neutral"}">${t.toUpperCase()}</span>`)
        .join(" ");
      return `
        <a href="${doc.url}" class="tile" aria-label="${doc.title}">
          ${img}
          <div class="tile-overlay">
            ${tags}
            <span class="tile-title">${doc.title}</span>
          </div>
        </a>`;
    }).join("") + '</div>';
  });

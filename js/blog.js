// Simple static blog renderer: fetches /blog/posts.json and renders cards
const container = document.getElementById('blog-list');
if (container) {
  fetch('/blog/posts.json')
    .then((r) => {
      if (!r.ok) throw new Error('Failed to load posts.json');
      return r.json();
    })
    .then((posts) => renderPosts(posts || []))
    .catch((err) => {
      console.error(err);
      container.innerHTML = '<p class="text-red-600">Could not load posts.</p>';
    });
}

function renderPosts(posts) {
  if (!posts.length) {
    container.innerHTML = '<p>No posts yet. Check back later.</p>';
    return;
  }

  container.innerHTML = posts
    .map((p) => {
      return `
        <article class="blog-card border rounded-lg overflow-hidden shadow-sm bg-white">
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2"><a href="${p.url}">${escapeHtml(p.title)}</a></h2>
            <p class="text-sm text-gray-600 mb-3">${escapeHtml(p.date)}</p>
            <p class="text-gray-700 mb-4">${escapeHtml(p.excerpt)}</p>
            <a class="text-secondary-color font-semibold" href="${p.url}">Read more →</a>
          </div>
        </article>
      `;
    })
    .join('');
}

function escapeHtml(s){
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

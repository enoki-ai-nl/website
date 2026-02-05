#!/usr/bin/env node

// This script builds the blog posts from markdown files in content/blog and outputs them as HTML files in blog/, along with a posts.json index.
// It uses markdown-it for markdown parsing and gray-matter for frontmatter.

import fs from 'fs/promises';
import path from 'path';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';

const CONTENT_DIR = path.resolve('content/blog');
const OUT_DIR = path.resolve('blog');
const POSTS_JSON = path.join(OUT_DIR, 'posts.json');

const md = new MarkdownIt({ html: true });

// Simple HTML escaping to prevent XSS in titles/excerpts
function escapeHtml(s){
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function build() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const files = await fs.readdir(CONTENT_DIR).catch(() => []);
  const posts = [];

  for (const file of files.filter(f => f.endsWith('.md'))) {
    const src = path.join(CONTENT_DIR, file);
    const raw = await fs.readFile(src, 'utf8');
    const { data, content } = matter(raw);
    const slug = data.slug || file.replace(/\.md$/, '');
    const title = data.title || slug;
    const date = data.date || new Date().toISOString().slice(0,10);
    const excerpt = data.excerpt || content.slice(0,160).replace(/\n/g,' ').trim();
    const html = md.render(content);

    const outHtml = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>${escapeHtml(title)} — Blog</title>\n<link rel="stylesheet" href="/src/css/styles.css">\n</head>\n<body>\n  <main class="container mx-auto px-4 py-12">\n    <article class="prose max-w-none">\n      <h1>${escapeHtml(title)}</h1>\n      <p class="text-sm text-gray-600">Published ${escapeHtml(date)}</p>\n      ${html}\n      <p><a href="/blog.html">← Back to blog</a></p>\n    </article>\n  </main>\n</body>\n</html>`;

    const outPath = path.join(OUT_DIR, `${slug}.html`);
    await fs.writeFile(outPath, outHtml, 'utf8');
    posts.push({ slug, title, date, excerpt, url: `/blog/${slug}.html` });
    console.log(`Wrote ${outPath}`);
  }

  posts.sort((a,b) => (b.date || '').localeCompare(a.date || ''));
  await fs.writeFile(POSTS_JSON, JSON.stringify(posts, null, 2), 'utf8');
  console.log(`Wrote ${POSTS_JSON}`);
}

build().catch(err => { console.error(err); process.exit(1); });

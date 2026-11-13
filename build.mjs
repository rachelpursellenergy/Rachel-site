// Builds the site into the "dist" folder. Netlify runs this for you: node build.mjs
// It fills the pages in /src with the settings in site.json.
import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
const settings = JSON.parse(fs.readFileSync(path.join(root, 'site.json'), 'utf8'));

// ---------- tiny template engine ----------
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function render(t, ctx) {
  // {{#each list}} ... {{this.x}} ... {{/each}}
  t = t.replace(/\{\{#each ([\w.]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (m, p, body) =>
    (get(ctx, p) || []).map(item => render(body, { ...ctx, this: item })).join(''));
  // {{#if x}} ... {{else}} ... {{/if}} (innermost first, so they can nest)
  let prev;
  do {
    prev = t;
    t = t.replace(/\{\{#if ([\w.]+)\}\}((?:(?!\{\{#if)[\s\S])*?)\{\{\/if\}\}/g, (m, p, body) => {
      const [a, b] = body.split('{{else}}');
      return get(ctx, p) ? a : (b || '');
    });
  } while (t !== prev);
  // {{some.setting}}
  return t.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, p) => {
    const v = get(ctx, p);
    if (v === undefined) throw new Error('Missing setting: ' + p);
    return esc(v);
  });
}

// ---------- extra values worked out from the settings ----------
const s = settings.sections;
const ctx = {
  ...settings,
  // image resizing only runs on Netlify (it has the Image CDN)
  cdn: Boolean(process.env.NETLIFY),
  // section background colors alternate so neighbors never match
  tone: {
    videos: 'sand',
    kind: s.videos ? 'cream' : 'sand'
  },
  tools: settings.tools.filter(t => !t.onlyWhen || s[t.onlyWhen]),
};

// ---------- pages ----------
const pages = [
  { file: 'index.html', out: 'index.html', url: '/', home: true,
    title: settings.site.title, desc: settings.site.description },
  { file: 'terms.html', out: 'terms.html', url: '/terms',
    title: 'Terms of Service | Rachel Pursell',
    desc: 'Client Consent and Client Bill of Rights for Rachel Pursell.' },
  { file: 'privacy.html', out: 'privacy.html', url: '/privacy',
    title: 'Privacy Policy | Rachel Pursell',
    desc: 'What information this site collects, why, and what happens to it.' },
];

const layout = fs.readFileSync(path.join(src, 'layout.html'), 'utf8');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const p of pages) {
  const body = render(fs.readFileSync(path.join(src, p.file), 'utf8'), ctx);
  const page = { title: p.title, desc: p.desc, url: p.url, home: p.home || false };
  const html = render(layout, { ...ctx, page }).replace('<!--CONTENT-->', () => body);
  fs.writeFileSync(path.join(dist, p.out), html);
}

// ---------- static files ----------
fs.copyFileSync(path.join(src, 'style.css'), path.join(dist, 'style.css'));
fs.copyFileSync(path.join(src, 'form.js'), path.join(dist, 'form.js'));
fs.cpSync(path.join(src, 'images'), path.join(dist, 'images'), { recursive: true });
fs.writeFileSync(path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${settings.site.url}/sitemap.xml\n`);
fs.writeFileSync(path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages.map(p => `  <url><loc>${settings.site.url}${p.url}</loc></url>`).join('\n') + `\n</urlset>\n`);

console.log('Built', pages.length, 'pages into dist/');

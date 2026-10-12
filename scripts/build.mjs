import {mkdir, readFile, writeFile, cp} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {content} from '../src/content.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, 'docs');
const origin = 'https://yehuitang0316.github.io/gear-site/';
// GitHub's official Octicons. License is distributed in assets/.
const starIcon = (await readFile(path.join(root,'static/assets/star-16.svg'),'utf8')).trim().replace('<svg ', '<svg class="star-icon" fill="currentColor" aria-hidden="true" focusable="false" ');
const starSnapshot = JSON.parse(await readFile(path.join(root,'src/github-stats.json'),'utf8'));
if(starSnapshot.repo!=='rsi-gear/gear'||!Number.isSafeInteger(starSnapshot.count)||starSnapshot.count<0||!Number.isFinite(Date.parse(starSnapshot.checkedAt)))throw new Error('Invalid GitHub stars snapshot');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const github = (await readFile(path.join(root,'static/assets/mark-github-16.svg'),'utf8')).trim().replace('<svg ', '<svg class="github-icon" fill="currentColor" aria-hidden="true" focusable="false" ');

function page(t, locale) {
  const base = locale === 'en' ? './' : '../';
  const url = origin + (locale === 'zh' ? 'zh/' : '');
  const asset = f => `${base}assets/${f}`;
  const brand = `<img src="${asset('gear-mark.jpeg')}" width="36" height="36" alt=""><span>GEAR</span>`;
  const star = starIcon;
  const starCount = `<span class="star-count" data-star-count>${starSnapshot.count.toLocaleString(t.lang)}</span>`;
  const starLink = (kind, label) => `<a class="star-link ${kind}" data-star-link href="${t.repo}" target="_blank" rel="noopener noreferrer" aria-label="${t.starLabel} · ${starSnapshot.count} stars" title="${t.starLabel}">${kind === 'star-header' ? `${github}<span class="repo-name">${starSnapshot.repo}</span>${star}${starCount}` : `${star}<span class="star-label">${label}</span>${starCount}`}</a>`;
  const inlineData = JSON.stringify({stars:{...starSnapshot,lang:t.lang,label:t.starLabel}}).replaceAll('<','\\u003c');
  return `<!doctype html>
<html lang="${t.lang}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${t.title}</title><meta name="description" content="${esc(t.description)}">
  <meta name="theme-color" content="#f7f8f5">
  <link rel="canonical" href="${url}"><link rel="alternate" hreflang="en" href="${origin}"><link rel="alternate" hreflang="zh-CN" href="${origin}zh/"><link rel="alternate" hreflang="x-default" href="${origin}">
  <meta property="og:type" content="website"><meta property="og:title" content="${t.title}"><meta property="og:description" content="${esc(t.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin}assets/intro-poster.png"><meta property="og:image:width" content="1920"><meta property="og:image:height" content="1080"><meta property="og:image:alt" content="GEAR — Skills, refined. Automatically."><meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/jpeg" href="${asset('gear-mark.jpeg')}"><link rel="stylesheet" href="${asset('style.css')}">
  <script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'SoftwareApplication',name:'GEAR',url,applicationCategory:'DeveloperApplication',operatingSystem:'macOS, Linux',description:t.description,license:`${t.repo}/blob/main/LICENSE`,isAccessibleForFree:true})}</script>
  <script id="page-data" type="application/json">${inlineData}</script><script defer src="${asset('app.js')}"></script><script defer src="${asset('stars.js')}"></script>
</head>
<body>
<a class="skip-link" href="#main">${t.skip}</a>
<header class="site-header"><div class="container header-inner">
  <a class="brand" href="#" aria-label="GEAR">${brand}</a>
  <nav class="desktop-nav" aria-label="${locale==='en'?'Main navigation':'主导航'}"><a href="#results">${t.nav[0]}</a><a href="#how-it-works">${t.howNav}</a></nav>
  <div class="header-actions"><a class="language" href="${locale==='en'?'./zh/':'../'}" lang="${locale==='en'?'zh-CN':'en'}" aria-label="${t.languageLabel}">${t.language}</a>${starLink('star-header',t.starShort)}</div>
</div></header>
<main id="main">
  <section class="hero container" aria-labelledby="hero-title">
    <div class="hero-copy"><h1 id="hero-title" lang="${t.lang}">${t.hero}</h1><p class="hero-description">${t.heroText}</p><div class="hero-star">${starLink('star-hero',t.starAction)}</div><div class="compatible"><p>${t.compatible}</p><div><span>Codex</span><span>Claude Code</span><span>DSH</span><span>Pi</span><span class="more-agent">+</span></div></div></div>
    <div class="hero-video-frame"><video class="hero-video" autoplay muted loop playsinline controls preload="metadata" poster="${asset('intro-poster.png')}" aria-label="${t.play}"><source src="${asset('gear-intro.mp4')}" type="video/mp4"><track kind="captions" src="${asset('intro.en.vtt')}" srclang="en" label="English"${locale==='en'?' default':''}><track kind="captions" src="${asset('intro.zh.vtt')}" srclang="zh" label="简体中文"${locale==='zh'?' default':''}></video></div>
  </section>
  <section class="featured-cases section-space" id="cases" aria-labelledby="cases-title"><div class="container"><div class="section-heading"><div><h2 id="cases-title">${t.casesTitle}</h2></div><p class="section-description">${t.casesText}</p></div><div class="case-grid">${t.cases.map((c,i)=>`<article class="case-card"><div class="case-top"><span class="micro-label">CASE 0${i+1}</span><span class="case-benchmark">AutomationBench / Marketing</span></div><h3>${c[0]}</h3><div class="case-video-frame"><video class="case-video" autoplay muted loop playsinline controls preload="metadata" aria-label="${c[0]}"><source src="${asset(i===0?'landing-page-alerts.mp4':'featured-snippet.mp4')}" type="video/mp4"></video></div></article>`).join('')}</div></div></section>
  <section class="container section-space results" id="results"><div class="section-heading"><div><h2>${t.resultsTitle}</h2></div><p class="section-description">${t.resultsText}</p></div><div class="benchmark-tabs" role="tablist" aria-label="Benchmark">${t.benchmarkTabs.map((s,i)=>`<button id="bench-tab-${i}" role="tab" aria-selected="${i===0}" aria-controls="benchmark-${i}" tabindex="${i===0?0:-1}" data-benchmark="${i}">${s}</button>`).join('')}</div><div class="results-layout"><div class="chart-area">${[0,1].map(i=>`<div id="benchmark-${i}" role="tabpanel" aria-labelledby="bench-tab-${i}" tabindex="0"${i===1?' hidden':''}><div class="chart-heading"><h3>${t.chartTitle[i]}</h3><span>${t.chartMetric[i]}</span></div><div class="bar-group"><div class="bar-label"><span>${t.before}</span><strong>${i===0?'75.37':'52.87'}%</strong></div><div class="bar-track"><div class="bar before-bar" style="--value:${i===0?'75.37':'52.87'}%"></div></div><p class="bar-context">${t.chartBaseline[i]}</p></div><div class="bar-group"><div class="bar-label"><span>${t.after}</span><strong>${i===0?'88.88':'84.26'}%</strong></div><div class="bar-track"><div class="bar after-bar" style="--value:${i===0?'88.88':'84.26'}%"></div></div><p class="bar-context">${t.chartOptimized}</p></div><p class="chart-aside">${t.chartAside[i]}</p></div>`).join('')}</div><aside class="cost-panel"><p class="micro-label">${t.costTitle}</p><div class="cost-stat">95.21<span>%</span><svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M14 4v20M5 15l9 9 9-9" stroke="currentColor" stroke-width="2"/></svg></div><h3>${t.metrics[1][2]}</h3><p>${t.costText}</p><div class="cost-comparison"><div><span>Astra max</span><strong>$1.1858</strong></div><div class="mini-bar astra"></div><div><span>Luna max</span><strong>$0.0568</strong></div><div class="mini-bar luna"></div></div><p class="cost-note">${t.costNote}</p></aside></div>
  </section>

  <section class="container section-space how-section" id="how-it-works" aria-labelledby="how-title"><div class="section-heading"><h2 id="how-title">${t.howTitle}</h2><p class="section-description">${t.howText}</p></div><div class="how-video-frame"><video class="how-video" autoplay muted loop playsinline controls preload="metadata" poster="${asset(`how-gear-works.${locale}.png`)}" aria-label="${t.howVideoLabel}"><source src="${asset(`how-gear-works.${locale}.mp4`)}" type="video/mp4"></video></div></section>

  <section class="container final-star" id="star" aria-label="${t.starLabel}"><p>${t.starHelp}</p>${starLink('star-closing',t.starAction)}</section>
</main>
<footer class="container footer"><div><a class="brand" href="#">${brand}</a><span>${t.footerLine}</span></div><nav aria-label="${locale==='en'?'Footer':'页脚'}">${[t.website,t.guide,t.repo,'https://discord.gg/ZduvAtS2k',`${t.repo}/blob/main/LICENSE`].map((url,i)=>`<a href="${url}">${t.footerLinks[i]}</a>`).join('')}</nav></footer>
<noscript><style>.benchmark-tabs{display:none}[id^="benchmark-"][hidden]{display:block;margin-top:40px}</style></noscript>
</body></html>`;
}

await mkdir(out,{recursive:true});
await cp(path.join(root,'static'),out,{recursive:true});
await mkdir(path.join(out,'zh'),{recursive:true});
await Promise.all(Object.entries(content).map(([locale,t])=>writeFile(path.join(out,locale==='en'?'index.html':'zh/index.html'),page(t,locale))));
await cp(path.join(root,'src/style.css'),path.join(out,'assets/style.css'));
await cp(path.join(root,'src/app.js'),path.join(out,'assets/app.js'));
await cp(path.join(root,'src/stars.js'),path.join(out,'assets/stars.js'));
await writeFile(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}</loc></url><url><loc>${origin}zh/</loc></url></urlset>`);
await writeFile(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin}sitemap.xml\n`);
console.log('Built English and Chinese pages in docs/');

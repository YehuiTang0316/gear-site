import {mkdir, readFile, writeFile, cp} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {content} from '../src/content.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, 'docs');
const origin = 'https://yehuitang0316.github.io/gear-site/';
// GitHub's official Octicons star-16. License is distributed in assets/.
const starIcon = (await readFile(path.join(root,'static/assets/star-16.svg'),'utf8')).trim().replace('<svg ', '<svg class="star-icon" fill="currentColor" aria-hidden="true" focusable="false" ');
const starSnapshot = JSON.parse(await readFile(path.join(root,'src/github-stats.json'),'utf8'));
if(starSnapshot.repo!=='rsi-gear/gear'||!Number.isSafeInteger(starSnapshot.count)||starSnapshot.count<0||!Number.isFinite(Date.parse(starSnapshot.checkedAt)))throw new Error('Invalid GitHub stars snapshot');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<span aria-hidden="true">↗</span>';
const github = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.61-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.33 4.68-4.56 4.93.36.31.68.92.68 1.85v2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>';

function page(t, locale) {
  const base = locale === 'en' ? './' : '../';
  const url = origin + (locale === 'zh' ? 'zh/' : '');
  const asset = f => `${base}assets/${f}`;
  const source = f => `${t.repo}/blob/main/docs/guide/${t.sourcePath}/${f}.md`;
  const brand = `<img src="${asset('gear-mark.jpeg')}" width="36" height="36" alt=""><span>GEAR</span>`;
  const star = starIcon;
  const starCount = `<span class="star-count" data-star-count>${starSnapshot.count.toLocaleString(t.lang)}</span>`;
  const snapshotTitle = `${t.starSnapshot}: ${starSnapshot.checkedAt.slice(0,10)}`;
  const starLink = (kind, label) => `<a class="star-link ${kind}" data-star-link href="${t.repo}" target="_blank" rel="noopener noreferrer" aria-label="${t.starLabel} · ${starSnapshot.count} stars" title="${snapshotTitle}">${star}<span class="star-label">${label}</span>${starCount}</a>`;
  const inlineData = JSON.stringify({demoRows:t.demoRows, demoComments:t.demoComments, demoStages:t.demoStages, copyPrompt:t.copyPrompt,copied:t.copied,copyFail:t.copyFail,play:t.play,pause:t.pause,stars:{...starSnapshot,lang:t.lang,label:t.starLabel,fresh:t.starFresh,snapshot:t.starSnapshot}}).replaceAll('<','\\u003c');
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
  <nav class="desktop-nav" aria-label="${locale==='en'?'Main navigation':'主导航'}"><a href="#cases">${t.casesNav}</a><a href="#how-it-works">${t.nav[0]}</a><a href="#results">${t.nav[1]}</a></nav>
  <div class="header-actions"><a class="language" href="${locale==='en'?'./zh/':'../'}" lang="${locale==='en'?'zh-CN':'en'}" aria-label="${t.languageLabel}">${t.language}</a>${starLink('star-header',t.starShort)}<a class="button button-small" href="#get-started">${t.nav[2]} <span aria-hidden="true">↗</span></a></div>
</div></header>
<main id="main">
  <section class="hero container" aria-labelledby="hero-title">
    <div class="hero-copy"><div class="eyebrow"><span class="status-dot"></span>${t.eyebrow}</div><h1 id="hero-title">${t.hero}</h1><p class="hero-description">${t.heroText}</p><div class="hero-actions"><a class="button" href="#cases">${t.casesNav}<span aria-hidden="true">↓</span></a><a class="watch-link" href="#intro"><span class="play-small" aria-hidden="true">▶</span>${t.watch}<span class="duration">${t.seconds}</span></a></div><div class="hero-star">${starLink('star-hero',t.starAction)}<span data-star-freshness>${snapshotTitle}</span></div><div class="compatible"><p>${t.compatible}</p><div><span>Codex</span><span>Claude Code</span><span>DSH</span><span class="more-agent">+</span></div></div></div>
    <div class="hero-visual" role="img" aria-label="${t.diagramLabel}">
      <div class="visual-grid"></div><div class="visual-orbit orbit-one"></div><div class="visual-orbit orbit-two"></div>
      <svg class="connectors" viewBox="0 0 580 530" fill="none" aria-hidden="true"><path d="M165 179V235Q165 255 185 255H282M308 280H400Q420 280 420 300V327"/><path class="feedback-path" d="M413 423V466Q413 478 398 478H97Q78 478 78 458V210Q78 190 100 190"/><circle cx="281" cy="255" r="3"/><circle cx="420" cy="327" r="3"/></svg>
      <div class="task-stack"><div class="micro-label">${t.taskSet}</div>${t.tasks.map((s,i)=>`<div class="task-item"><span class="task-icon">${['⌕','▦','≡'][i]}</span>${s}<span class="task-indicator"></span></div>`).join('')}</div>
      <div class="engine"><img src="${asset('gear-mark.jpeg')}" alt="" width="56" height="56"><span>GEAR</span><div class="engine-label"><span>${t.evaluate}</span><i>↔</i><span>${t.refine}</span></div></div>
      <div class="refined-skill"><div class="skill-heading"><span>▤ &nbsp; report.md</span><span class="version">v.next</span></div><div class="micro-label">${t.skill}</div>${t.skillRows.map(s=>`<div class="skill-row"><span>✓</span>${s}</div>`).join('')}<div class="skill-footer"><span class="status-dot"></span>${t.retained}</div></div>
      <span class="feedback-label">↻ ${t.feedback}</span><span class="illustration-label">${t.illustration}</span>
    </div>
  </section>
  <section class="featured-cases section-space" id="cases" aria-labelledby="cases-title"><div class="container"><div class="section-heading"><div><p class="eyebrow">${t.casesLabel}</p><h2 id="cases-title">${t.casesTitle}</h2></div><p class="section-description">${t.casesText}</p></div><div class="case-grid">${t.cases.map((c,i)=>`<article class="case-card"><div class="case-top"><span class="micro-label">CASE 0${i+1}</span><span class="case-benchmark">AutomationBench / Marketing</span></div><h3>${c[0]}</h3><div class="case-comparison"><div class="case-side case-gear"><span class="case-model">Luna max + GEAR</span><strong class="case-result">${i===0?'5':'2'}<span> / ${i===0?'5':'2'}</span></strong><span class="case-checks">${t.caseChecks}</span><p><span aria-hidden="true">✓</span>${t.caseOutcomes[i][0]}</p></div><div class="case-side case-baseline"><span class="case-model">Astra max + Codex</span><strong class="case-result">${i===0?'4':'1'}<span> / ${i===0?'5':'2'}</span></strong><span class="case-checks">${t.caseChecks}</span><p><span aria-hidden="true">−</span>${t.caseOutcomes[i][1]}</p></div></div><div class="case-bottom"><span>${t.caseModel}</span><button class="case-watch" data-video="${asset(i===0?'landing-page-alerts.mp4':'featured-snippet.mp4')}" data-title="${c[0]}" aria-label="${t.caseWatch}: ${c[0]}"><span aria-hidden="true">▶</span> ${t.caseWatch} ${arrow}</button></div></article>`).join('')}</div></div></section>
  <section class="metrics container" aria-label="${t.resultsLabel}">${t.metrics.map(m=>`<div class="metric"><div class="metric-value">${m[0]}<span>${m[1]}</span></div><h2>${m[2]}</h2><p>${m[3]}</p></div>`).join('')}<p class="metric-foot">${t.metricFoot} <a href="#results">${t.sources} ↗</a></p></section>

  <section class="film-section section-space" id="intro"><div class="container film-layout"><div class="film-copy"><p class="eyebrow">${t.filmLabel}</p><h2>${t.filmTitle}</h2><p>${t.filmText}</p><div class="film-number">00:18 <span> / GEAR</span></div></div><div class="film-media"><div class="video-frame"><video id="intro-video" controls playsinline preload="none" poster="${asset('intro-poster.png')}" aria-label="${t.play}"><source src="${asset('gear-intro.mp4')}" type="video/mp4"><track kind="captions" src="${asset('intro.en.vtt')}" srclang="en" label="English"${locale==='en'?' default':''}><track kind="captions" src="${asset('intro.zh.vtt')}" srclang="zh" label="简体中文"${locale==='zh'?' default':''}></video><button class="film-play" aria-label="${t.play}"><span aria-hidden="true">▶</span></button></div><div class="film-meta"><span>${t.filmNote}</span><details><summary>${t.transcript}</summary><p>${t.transcriptText}</p></details></div></div></div></section>

  <section class="container section-space" id="how-it-works"><div class="section-heading"><div><p class="eyebrow">${t.loopLabel}</p><h2>${t.loopTitle}</h2></div><p class="section-description">${t.loopText}</p></div><div class="loop-layout"><div class="loop-steps" role="tablist" aria-label="${t.demoTitle}">${t.steps.map((s,i)=>`<button id="step-${i}" class="loop-step${i===0?' active':''}" role="tab" aria-selected="${i===0}" aria-controls="demo-panel" tabindex="${i===0?0:-1}" data-step="${i}"><span class="step-number">${s[0]}</span><span><strong>${s[1]}</strong><span class="step-description">${s[2]}</span></span><span class="step-arrow" aria-hidden="true">↗</span></button>`).join('')}</div><div class="demo-area"><div class="demo-window" id="demo-panel" role="tabpanel" tabindex="0" aria-labelledby="step-0"><div class="window-bar"><div class="window-dots"><i></i><i></i><i></i></div><span>GEAR / REFINE</span><span id="demo-version">01</span></div><div class="demo-content"><div class="demo-file"><span>▤ &nbsp;${t.demoFile}</span><span id="demo-stage">${t.demoStages[0]}</span></div><div id="demo-rows">${t.demoRows[0].map((r,i)=>`<div class="demo-row${i===2?' flagged':''}"><span class="checkbox"></span>${r}${i===2?'<span class="row-warning">↺</span>':''}</div>`).join('')}</div><div class="demo-comment" id="demo-comment">${t.demoComments[0]}</div></div></div><p class="demo-note">${t.demoNote}</p></div></div></section>

  <section class="scope-section section-space"><div class="container"><div class="section-heading"><div><p class="eyebrow">${t.scopeLabel}</p><h2>${t.scopeTitle}</h2></div><p class="section-description">${t.scopeText}</p></div><div class="scope-list">${t.scopes.map(s=>`<article class="scope-item"><span class="scope-number">${s[0]}</span><h3>${s[1]}</h3><p>${s[2]}</p></article>`).join('')}</div><div class="roadmap-note"><span>${t.roadmap}</span><p>${t.roadmapText}</p></div></div></section>

  <section class="container section-space results" id="results"><div class="section-heading"><div><p class="eyebrow">${t.resultsLabel}</p><h2>${t.resultsTitle}</h2></div><p class="section-description">${t.resultsText}</p></div><div class="benchmark-tabs" role="tablist" aria-label="Benchmark">${t.benchmarkTabs.map((s,i)=>`<button id="bench-tab-${i}" role="tab" aria-selected="${i===0}" aria-controls="benchmark-${i}" tabindex="${i===0?0:-1}" data-benchmark="${i}">${s}</button>`).join('')}</div><div class="results-layout"><div class="chart-area">${[0,1].map(i=>`<div id="benchmark-${i}" role="tabpanel" aria-labelledby="bench-tab-${i}" tabindex="0"${i===1?' hidden':''}><div class="chart-heading"><h3>${t.chartTitle[i]}</h3><span>${t.chartMetric[i]}</span></div><div class="bar-group"><div class="bar-label"><span>${t.before}</span><strong>${i===0?'75.37':'52.87'}%</strong></div><div class="bar-track"><div class="bar before-bar" style="--value:${i===0?'75.37':'52.87'}%"></div></div><p class="bar-context">${t.chartBaseline[i]}</p></div><div class="bar-group"><div class="bar-label"><span>${t.after}</span><strong>${i===0?'88.88':'84.26'}%</strong></div><div class="bar-track"><div class="bar after-bar" style="--value:${i===0?'88.88':'84.26'}%"></div></div><p class="bar-context">${t.chartOptimized}</p></div><p class="chart-aside">${t.chartAside[i]}</p></div>`).join('')}<div class="chart-method"><p>${t.chartMethod}</p><a href="${source('results')}">${t.sources} ${arrow}</a><a href="${source('example-algorithm')}">${t.experiment} ${arrow}</a></div></div><aside class="cost-panel"><p class="micro-label">${t.costTitle}</p><div class="cost-stat">95.21<span>%</span><svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M14 4v20M5 15l9 9 9-9" stroke="currentColor" stroke-width="2"/></svg></div><h3>${t.metrics[1][2]}</h3><p>${t.costText}</p><div class="cost-comparison"><div><span>Astra max</span><strong>$1.1858</strong></div><div class="mini-bar astra"></div><div><span>Luna max</span><strong>$0.0568</strong></div><div class="mini-bar luna"></div></div><p class="cost-note">${t.costNote}</p><a href="${t.repo}/blob/main/docs/marketing-token-cost${locale==='zh'?'.zh-CN':''}.md">${t.costLink} ${arrow}</a></aside></div>
  </section>

  <section class="start-section section-space" id="get-started"><div class="container start-layout"><div class="start-copy"><p class="eyebrow">${t.startLabel}</p><h2>${t.startTitle}</h2><p>${t.startText}</p><button class="button button-light" id="copy-prompt">${t.copyPrompt}<span aria-hidden="true">↗</span></button><p class="copy-status" role="status" id="copy-status"></p><a class="text-link" href="${t.guide}/quickstart">${t.setupGuide} ${arrow}</a></div><div class="setup-panel"><details class="prompt-detail"><summary>${t.promptLabel}</summary><pre id="setup-prompt">${esc(t.prompt)}</pre></details><div class="terminal-block"><div class="terminal-label"><span>${t.manual}</span><span>TERMINAL</span></div><pre><span class="code-dollar">$</span> npm install --global \\
    rsi-gear@latest \\
    agent-hitch@latest</pre><p>${t.commandNote}</p></div><div class="first-run"><h3>${t.firstRun}</h3><p>${t.firstRunText}</p></div></div></div></section>

  <section class="container section-space faq"><h2>${t.faqTitle}</h2><div>${t.faqs.map(f=>`<details><summary>${f[0]}<span aria-hidden="true">+</span></summary><p>${f[1]}</p></details>`).join('')}</div></section>
  <section class="container closing"><p>${t.closing}</p><div class="closing-star">${starLink('star-closing',t.starAction)}<p>${t.starHelp}</p></div></section>
</main>
<footer class="container footer"><div><a class="brand" href="#">${brand}</a><span>${t.footerLine}</span></div><nav aria-label="${locale==='en'?'Footer':'页脚'}">${[t.guide,t.repo,'https://discord.gg/cZ4NBbHDk',`${t.repo}/blob/main/LICENSE`].map((url,i)=>`<a href="${url}">${t.footerLinks[i]}</a>`).join('')}</nav></footer>
<dialog id="replay-dialog" aria-labelledby="replay-title"><div class="dialog-header"><h2 id="replay-title"></h2><button class="close-dialog" aria-label="${t.caseClose}">×</button></div><video id="replay-video" controls playsinline preload="none"></video></dialog>
<noscript><style>.film-play{display:none}.benchmark-tabs,.loop-steps,.case-watch{display:none}[id^="benchmark-"][hidden]{display:block;margin-top:40px}</style><p class="container">${locale==='en'?'Enable JavaScript for interactive diagrams and replay controls. The introduction video, documentation, results, and setup prompt remain available.':'启用 JavaScript 可使用交互流程与回放控制；介绍视频、文档、评测结果与安装提示词仍可直接查看。'}</p></noscript>
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

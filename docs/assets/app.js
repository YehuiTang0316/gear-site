(() => {
  const data = JSON.parse(document.querySelector('#page-data').textContent);
  const intro = document.querySelector('#intro-video');
  const play = document.querySelector('.film-play');
  play.addEventListener('click', async () => {
    try { await intro.play(); } catch { intro.controls = true; play.hidden = true; }
  });
  intro.addEventListener('play', () => { play.hidden = true; });
  intro.addEventListener('ended', () => { play.hidden = false; });

  function wireTabs(selector, callback) {
    const tabs = [...document.querySelectorAll(selector)];
    function select(tab, focus=false) {
      tabs.forEach(t => { const selected = t===tab; t.setAttribute('aria-selected', String(selected)); t.tabIndex = selected ? 0 : -1; t.classList.toggle('active',selected); });
      callback(tabs.indexOf(tab));
      if (focus) tab.focus();
    }
    tabs.forEach((tab,i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', event => {
        let next;
        if (['ArrowRight','ArrowDown'].includes(event.key)) next=(i+1)%tabs.length;
        if (['ArrowLeft','ArrowUp'].includes(event.key)) next=(i-1+tabs.length)%tabs.length;
        if (event.key==='Home') next=0;
        if (event.key==='End') next=tabs.length-1;
        if (next !== undefined) {event.preventDefault(); select(tabs[next], true);}
      });
    });
  }
  wireTabs('[data-step]', i => {
    document.querySelector('#demo-panel').setAttribute('aria-labelledby',`step-${i}`);
    document.querySelector('#demo-version').textContent = `0${i+1}`;
    document.querySelector('#demo-stage').textContent = data.demoStages[i];
    document.querySelector('#demo-comment').textContent = data.demoComments[i];
    const rows = document.querySelector('#demo-rows'); rows.replaceChildren();
    data.demoRows[i].forEach((text,n) => {
      const row=document.createElement('div'); row.className=`demo-row${i===0&&n===2?' flagged':''}${i===2?' checked':''}`;
      const check=document.createElement('span'); check.className='checkbox'; check.textContent=i===2?'✓':'';
      row.append(check,document.createTextNode(text));
      if(i===0&&n===2){const flag=document.createElement('span');flag.className='row-warning';flag.textContent='↺';row.append(flag);}
      rows.append(row);
    });
  });
  wireTabs('[data-benchmark]', i => {
    document.querySelectorAll('[id^="benchmark-"]').forEach((p,n) => { p.hidden = i!==n; });
  });
  document.querySelector('#copy-prompt').addEventListener('click', async () => {
    const status=document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(document.querySelector('#setup-prompt').textContent);
      status.textContent=`✓ ${data.copied}`;
    } catch {
      document.querySelector('.prompt-detail').open=true;
      status.textContent=data.copyFail;
      const range=document.createRange();range.selectNodeContents(document.querySelector('#setup-prompt'));
      const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
    }
  });
  // Start the inline replays when they enter view; pause them offscreen.
  // Native controls remain available and a manual pause is preserved in view.
  const caseVideos = [...document.querySelectorAll('.case-video')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({target: video, isIntersecting}) => {
        video.autoplay = isIntersecting;
        if (isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    }, {threshold: 0.15});
    caseVideos.forEach(video => observer.observe(video));
  }
})();

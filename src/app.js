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
  const dialog=document.querySelector('#replay-dialog');
  const replay=document.querySelector('#replay-video');
  let previousFocus;
  document.querySelectorAll('[data-video]').forEach(button => button.addEventListener('click', () => {
    previousFocus=button;
    intro.pause();
    document.querySelector('#replay-title').textContent=button.dataset.title;
    replay.src=button.dataset.video;
    dialog.showModal();document.body.classList.add('dialog-open');
    replay.play().catch(()=>{});
  }));
  document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click', event => { if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();} });
  dialog.addEventListener('close', () => {replay.pause();replay.removeAttribute('src');replay.load();document.body.classList.remove('dialog-open');previousFocus?.focus();});
})();

(() => {
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
  wireTabs('[data-benchmark]', i => {
    document.querySelectorAll('[id^="benchmark-"]').forEach((p,n) => { p.hidden = i!==n; });
  });
  // Play the product film, case replays and how-it-works film in view; pause them offscreen.
  // Native controls remain available and a manual pause is preserved in view.
  const videos = [...document.querySelectorAll('.hero-video, .case-video, .how-video')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({target: video, isIntersecting}) => {
        video.autoplay = isIntersecting;
        if (isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    }, {threshold: 0.15});
    videos.forEach(video => observer.observe(video));
  }
})();

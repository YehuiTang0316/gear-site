(() => {
  const config = JSON.parse(document.querySelector('#page-data').textContent).stars;
  const cacheKey = 'gear:github-stars:v1';
  const maxAge = 5 * 60 * 1000;
  let inFlight = false;
  let returningFromGitHub = false;
  let current = {count: config.count, checkedAt: Date.parse(config.checkedAt)};
  const valid = value => value && Number.isSafeInteger(value.count) && value.count >= 0 &&
    Number.isFinite(value.checkedAt) && value.checkedAt > 0 && value.checkedAt <= Date.now();

  function render(value) {
    current = value;
    const count = value.count.toLocaleString(config.lang);
    document.querySelectorAll('[data-star-count]').forEach(el => { el.textContent = count; });
    document.querySelectorAll('[data-star-link]').forEach(el => {
      el.setAttribute('aria-label', `${config.label} · ${count} stars`);
      el.title = `${config.label} · ${count} stars`;
    });
  }

  async function refresh(force = false) {
    if (inFlight) return;
    if (!force) {
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey));
        if (valid(cached) && cached.checkedAt >= current.checkedAt) {
          render(cached);
          if (Date.now() - cached.checkedAt < maxAge) return;
        }
      } catch { /* Storage can be blocked; the public request still works. */ }
    }
    inFlight = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch('https://api.github.com/repos/rsi-gear/gear', {
        headers: {Accept: 'application/vnd.github+json'},
        credentials: 'omit', signal: controller.signal,
      });
      if (!response.ok) throw new Error('GitHub data unavailable');
      const repo = await response.json();
      const next = {count: repo.stargazers_count, checkedAt: Date.now()};
      if (repo.full_name !== config.repo || !valid(next)) throw new Error('Invalid GitHub data');
      render(next);
      try { localStorage.setItem(cacheKey, JSON.stringify(next)); } catch { /* Optional cache. */ }
    } catch {
      // Keep the last verified count when GitHub is temporarily unavailable.
      render(current);
    } finally {
      clearTimeout(timeout);
      inFlight = false;
    }
  }

  document.querySelectorAll('[data-star-link]').forEach(el => el.addEventListener('click', () => {
    returningFromGitHub = true;
  }));
  function onReturn() {
    if (returningFromGitHub && document.visibilityState === 'visible') {
      returningFromGitHub = false;
      refresh(true);
    }
  }
  window.addEventListener('focus', onReturn);
  document.addEventListener('visibilitychange', onReturn);
  refresh();
})();

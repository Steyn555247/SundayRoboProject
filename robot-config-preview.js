(function () {
  const STORAGE_KEY = 'memoRobotConfig';
  const DEFAULT_CONFIG = 'orange';
  const ONBOARDING_PAGE = 'memo-onboarding.html';
  const APP_HOME_PAGE = 'memo-dashboard-v5.html';
  const APP_INTRO_SESSION_KEY = 'memoAppIntroSeen';
  const SUNDAY_URL = 'https://sunday.ai';
  const STEYN_LINKEDIN_URL = 'https://www.linkedin.com/in/steyn-knollema';
  const APP_BUTTON_YELLOW = '#F5E100';
  const CONFIGS = {
    orange: {
      label: 'Orange',
      accent: '#E85D24',
      accentRgb: '232, 93, 36',
      soft: '#FBF0ED',
      border: '#F0C4B0'
    },
    green: {
      label: 'Green',
      accent: '#2F8A5A',
      accentRgb: '47, 138, 90',
      soft: '#EAF5EE',
      border: '#B9DAC7'
    },
    yellow: {
      label: 'Yellow',
      accent: '#B78610',
      accentRgb: '183, 134, 16',
      soft: '#FCF5E7',
      border: '#E8D39B'
    },
    blue: {
      label: 'Blue',
      accent: '#2B6CB0',
      accentRgb: '43, 108, 176',
      soft: '#ECF3FB',
      border: '#B7CDE8'
    }
  };
  const PAGE_OVERVIEWS = {
    'memo-onboarding.html': {
      title: 'Onboarding',
      idea: 'Turn setup into a guided first run instead of a technical install.',
      elements: 'Bluetooth pairing, home mapping, zone confirmation, and safety questions build trust before Memo starts working.',
      why: 'Each step explains what Memo is learning so the user never loses context during setup.',
      choices: 'Large progress moments, conversational copy, and map confirmations make the flow feel assisted rather than procedural.'
    },
    'memo-dashboard-v5.html': {
      title: 'Home',
      idea: 'Act as the main command center for daily use.',
      elements: 'The hero gives Memo status fast, quick launch handles common jobs, and the lower cards summarize activity, schedule, and controls.',
      why: 'The page prioritizes the actions people repeat most often so they do not have to hunt through the app.',
      choices: 'A bold hero, compressed card stack, and ambient robot portrait keep the screen useful while still feeling premium.'
    },
    'memo-skills-v3.html': {
      title: 'Skills',
      idea: 'Present Memo as a capability catalog rather than a settings list.',
      elements: 'Category filters, skill cards, reliability badges, and durations explain what Memo can do right now.',
      why: 'Users need to understand availability, confidence, and effort before committing to a task.',
      choices: 'The layout uses strong card hierarchy and concise metadata so browsing feels quick and decisive.'
    },
    'memo-schedule.html': {
      title: 'Schedule',
      idea: 'Make planning feel predictable and time-based.',
      elements: 'Day pills, morning to evening groupings, task cards, and the add-task sheet organize work by when it happens.',
      why: 'Scheduling is easier to trust when the whole day can be scanned in one vertical pass.',
      choices: 'Soft status tags, clear spacing, and the playback overview turn a utility page into something more legible and alive.'
    },
    'memo-activity.html': {
      title: 'Activity',
      idea: 'Show proof of work, alerts, and recoveries in one operational feed.',
      elements: 'The hero snapshot, event cards, inline recordings, and live feed overlay explain what Memo did and what needs attention.',
      why: 'People trust automation more when they can inspect recent history instead of relying on a single status line.',
      choices: 'The design leans on evidence-heavy cards, alert contrast, and expandable media instead of hiding detail behind separate pages.'
    },
    'memo-map.html': {
      title: 'Map',
      idea: 'Translate Memo movement into a simple spatial control view.',
      elements: 'The floor map, live location card, path hints, and room summaries show where Memo is, where it has been, and what it can access.',
      why: 'A spatial page should answer location and permission questions immediately without extra navigation.',
      choices: 'The floor plan is intentionally abstract, while markers and overlays carry the detail so the screen stays readable at a glance.'
    },
    'memo-settings.html': {
      title: 'Settings',
      idea: 'Collect behavior, privacy, safety, and alert choices in one calm control surface.',
      elements: 'The hero frames the page purpose, and grouped rows separate notification, autonomy, access, and safety decisions.',
      why: 'System-level changes feel safer when they are centralized and described in plain language.',
      choices: 'The page uses restrained cards, consistent toggles, and close-up robot art to keep a potentially dense screen approachable.'
    }
  };
  const APP_PAGE_KEYS = Object.keys(PAGE_OVERVIEWS).filter((pageKey) => pageKey !== ONBOARDING_PAGE);
  const PAGE_BACKGROUND_OVERRIDES = {
    'memo-onboarding.html': [
      {
        selector: '.s0-robot',
        default: 'Untitled%20design(11).png',
        blue: 'Blue%20large.png'
      },
      {
        selector: '.s1-face-wrap',
        default: '7.png',
        blue: 'Blue%20close%20up.png',
        green: 'Green%20close%20up.png',
        yellow: 'Yellow%20close%20up.png'
      },
      {
        selector: '.s5-face',
        default: 'Untitled%20design(14).png',
        blue: 'Blue%20close%20up.png',
        green: 'Green%20close%20up.png',
        yellow: 'Yellow%20close%20up.png'
      },
      {
        selector: '.s6-robot',
        default: '9.png',
        blue: 'Blue%20large.png'
      }
    ]
  };

  function isValidConfig(value) {
    return Object.prototype.hasOwnProperty.call(CONFIGS, value);
  }

  function resolveConfig() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('config');
    if (isValidConfig(fromQuery)) return fromQuery;

    try {
      const fromStorage = window.localStorage.getItem(STORAGE_KEY);
      if (isValidConfig(fromStorage)) return fromStorage;
    } catch (error) {
      // Ignore storage failures and keep the preview functional.
    }

    const fromDataset = document.documentElement.dataset.robotConfig;
    return isValidConfig(fromDataset) ? fromDataset : DEFAULT_CONFIG;
  }

  let activeConfig = resolveConfig();
  document.documentElement.dataset.robotConfig = activeConfig;

  function persistConfig(config) {
    try {
      window.localStorage.setItem(STORAGE_KEY, config);
    } catch (error) {
      // Ignore storage failures and keep the preview functional.
    }
  }

  function syncUrl(config) {
    const url = new URL(window.location.href);
    url.searchParams.set('config', isValidConfig(config) ? config : DEFAULT_CONFIG);
    window.history.replaceState(null, '', url.toString());
  }

  function updateActiveButtons() {
    document.querySelectorAll('[data-robot-config-button]').forEach((button) => {
      button.classList.toggle('active', button.dataset.robotConfigButton === activeConfig);
      button.setAttribute('aria-pressed', String(button.dataset.robotConfigButton === activeConfig));
    });
  }

  function updateConfigImages() {
    document.querySelectorAll('[data-robot-config-image]').forEach((image) => {
      const defaultSrc = image.dataset.robotConfigSrcDefault || image.getAttribute('src');
      if (!defaultSrc) return;
      if (!image.dataset.robotConfigSrcDefault) {
        image.dataset.robotConfigSrcDefault = defaultSrc;
      }

      const configKey = `robotConfigSrc${activeConfig.charAt(0).toUpperCase()}${activeConfig.slice(1)}`;
      const nextSrc = image.dataset[configKey] || image.dataset.robotConfigSrcDefault;
      if (nextSrc && image.getAttribute('src') !== nextSrc) {
        image.setAttribute('src', nextSrc);
      }
    });
  }

  function applyConfigBackground(node, sources) {
    const defaultBg = sources.default;
    if (!defaultBg) return;

    const nextBg = sources[activeConfig] || defaultBg;
    node.style.setProperty('--robot-config-bg-image', `url("${nextBg}")`);
  }

  function updateConfigBackgrounds() {
    document.querySelectorAll('[data-robot-config-background]').forEach((node) => {
      const configKey = `robotConfigBg${activeConfig.charAt(0).toUpperCase()}${activeConfig.slice(1)}`;
      applyConfigBackground(node, {
        default: node.dataset.robotConfigBgDefault,
        [activeConfig]: node.dataset[configKey]
      });
    });

    const pageOverrides = PAGE_BACKGROUND_OVERRIDES[getCurrentPageKey()] || [];
    pageOverrides.forEach((override) => {
      document.querySelectorAll(override.selector).forEach((node) => {
        applyConfigBackground(node, override);
      });
    });
  }

  function setConfig(config, options) {
    const nextConfig = isValidConfig(config) ? config : DEFAULT_CONFIG;
    const opts = options || {};
    activeConfig = nextConfig;
    document.documentElement.dataset.robotConfig = nextConfig;
    persistConfig(nextConfig);
    updateActiveButtons();
    updateConfigImages();
    updateConfigBackgrounds();
    rewriteInternalLinks();
    if (opts.syncUrl !== false) syncUrl(nextConfig);
  }

  function getConfig() {
    return activeConfig;
  }

  function withConfig(path) {
    const url = new URL(path, window.location.href);
    url.searchParams.set('config', activeConfig);
    return url.toString();
  }

  function navigate(path) {
    window.location.href = withConfig(path);
  }

  function toInternalHtmlUrl(path) {
    try {
      const url = new URL(path, window.location.href);
      const isHtmlPage = url.pathname.toLowerCase().endsWith('.html');
      const sameOrigin = url.protocol === window.location.protocol && url.host === window.location.host;
      return isHtmlPage && sameOrigin ? url : null;
    } catch (error) {
      return null;
    }
  }

  function rewriteInternalLinks() {
    document.querySelectorAll('a[href]').forEach((anchor) => {
      const rawHref = anchor.getAttribute('href');
      if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
        return;
      }

      const targetUrl = toInternalHtmlUrl(rawHref);
      if (!targetUrl) return;

      if (!anchor.dataset.robotConfigHrefOriginal) {
        anchor.dataset.robotConfigHrefOriginal = rawHref;
      }
      anchor.href = withConfig(anchor.dataset.robotConfigHrefOriginal);
    });
  }

  function bindInternalNavigation() {
    if (!document.body || document.body.dataset.robotConfigNavigationBound === 'true') return;

    document.body.dataset.robotConfigNavigationBound = 'true';
    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!target) return;
      if (target.hasAttribute('download')) return;
      if (target.target && target.target !== '_self') return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

      const rawHref = target.dataset.robotConfigHrefOriginal || target.getAttribute('href');
      const internalUrl = toInternalHtmlUrl(rawHref || target.href);
      if (!internalUrl) return;

      event.preventDefault();
      navigate(rawHref || target.href);
    }, true);
  }

  function getCurrentPageKey() {
    return window.location.pathname.split('/').pop().toLowerCase();
  }

  function isOnboardingPage() {
    return getCurrentPageKey() === ONBOARDING_PAGE;
  }

  function isAppPage() {
    return APP_PAGE_KEYS.includes(getCurrentPageKey());
  }

  function hasSeenAppIntro() {
    try {
      return window.sessionStorage.getItem(APP_INTRO_SESSION_KEY) === 'true';
    } catch (error) {
      return false;
    }
  }

  function markAppIntroSeen() {
    try {
      window.sessionStorage.setItem(APP_INTRO_SESSION_KEY, 'true');
    } catch (error) {
      // Ignore storage failures and keep the preview functional.
    }
  }

  function injectStyles() {
    if (document.getElementById('robot-config-preview-styles')) return;

    const style = document.createElement('style');
    style.id = 'robot-config-preview-styles';
    style.textContent = `
      :root[data-robot-config="yellow"] {
        --robot-accent: ${CONFIGS.yellow.accent};
        --robot-accent-rgb: ${CONFIGS.yellow.accentRgb};
        --robot-accent-soft: ${CONFIGS.yellow.soft};
        --robot-accent-border: ${CONFIGS.yellow.border};
        --robot-accent-line: rgba(${CONFIGS.yellow.accentRgb}, 0.22);
        --robot-accent-glow: rgba(${CONFIGS.yellow.accentRgb}, 0.18);
      }
      :root[data-robot-config="blue"] {
        --robot-accent: ${CONFIGS.blue.accent};
        --robot-accent-rgb: ${CONFIGS.blue.accentRgb};
        --robot-accent-soft: ${CONFIGS.blue.soft};
        --robot-accent-border: ${CONFIGS.blue.border};
        --robot-accent-line: rgba(${CONFIGS.blue.accentRgb}, 0.22);
        --robot-accent-glow: rgba(${CONFIGS.blue.accentRgb}, 0.18);
      }
      .recording-brand,
      .recording-credit {
        pointer-events: auto;
      }
      .recording-logo-link,
      .recording-credit-link {
        color: inherit;
        text-decoration: none;
      }
      .recording-logo-link {
        display: block;
        border-radius: 18px;
      }
      .recording-logo-link:hover .recording-logo {
        opacity: 1;
        transform: translateY(-1px);
      }
      .recording-logo {
        transition: transform 0.16s ease, opacity 0.16s ease;
      }
      .recording-credit-link {
        color: #1C1B19;
        transition: color 0.16s ease;
      }
      .recording-credit-link:hover {
        color: ${APP_BUTTON_YELLOW};
      }
      .recording-logo-link:focus-visible,
      .recording-credit-link:focus-visible,
      .preview-control-dock__toggle:focus-visible,
      .app-intro-overlay__logo-link:focus-visible,
      .app-intro-overlay__signature:focus-visible {
        outline: 2px solid rgba(var(--robot-accent-rgb), 0.42);
        outline-offset: 4px;
      }
      .preview-support-stack {
        position: fixed;
        left: 24px;
        bottom: 24px;
        z-index: 235;
        width: min(320px, calc(100vw - 32px));
        display: grid;
        gap: 12px;
        align-items: end;
      }
      .preview-control-dock {
        position: relative;
        width: 100%;
        border-radius: 26px;
        border: 1px solid rgba(28, 27, 25, 0.08);
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(249, 248, 244, 0.84)),
          rgba(255, 255, 255, 0.78);
        backdrop-filter: blur(18px);
        box-shadow: 0 22px 44px rgba(17, 17, 16, 0.12);
        overflow: hidden;
      }
      .preview-control-dock__toggle {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 14px 15px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
      }
      .preview-control-dock__toggle-copy {
        min-width: 0;
      }
      .preview-control-dock__toggle-kicker,
      .preview-control-dock__eyebrow,
      .robot-config-switcher__label,
      .recording-mode-rail__title {
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #7A776F;
      }
      .preview-control-dock__toggle-kicker {
        display: block;
        margin-bottom: 4px;
      }
      .preview-control-dock__toggle-title {
        display: block;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 16px;
        font-weight: 600;
        line-height: 1.15;
        letter-spacing: -0.03em;
        color: #1C1B19;
        white-space: normal;
        overflow-wrap: anywhere;
      }
      .preview-control-dock__toggle-icon {
        width: 30px;
        height: 30px;
        border-radius: 999px;
        border: 1px solid rgba(28, 27, 25, 0.08);
        background: rgba(244, 242, 237, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: transform 0.16s ease;
      }
      .preview-control-dock.open .preview-control-dock__toggle-icon {
        transform: rotate(45deg);
      }
      .preview-control-dock__panel {
        display: none;
        padding: 0 15px 15px;
        border-top: 1px solid rgba(28, 27, 25, 0.08);
      }
      .preview-control-dock.open .preview-control-dock__panel {
        display: grid;
        gap: 14px;
      }
      .preview-control-dock__header {
        display: grid;
        gap: 6px;
        padding-top: 14px;
      }
      .preview-control-dock__title {
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.1;
        letter-spacing: -0.04em;
        color: #1C1B19;
        white-space: normal;
        overflow-wrap: anywhere;
      }
      .preview-control-dock__copy {
        margin: 0;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 13px;
        line-height: 1.5;
        color: #5A584F;
        white-space: normal;
        overflow-wrap: anywhere;
      }
      .preview-control-dock__sections {
        display: grid;
        gap: 12px;
      }
      .robot-config-switcher,
      .recording-mode-rail {
        display: grid;
        gap: 9px;
      }
      .recording-mode-rail__grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 8px;
      }
      .robot-config-switcher__grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }
      .robot-config-switcher__button,
      .recording-mode-rail__button {
        border: 1px solid rgba(28, 27, 25, 0.08);
        background: rgba(244, 242, 237, 0.88);
        border-radius: 18px;
        padding: 11px 12px;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 10px;
        cursor: pointer;
        text-align: left;
        transition: transform 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease, background 0.12s ease, color 0.12s ease;
        font-family: 'Geist', -apple-system, sans-serif;
        color: #1C1B19;
        min-width: 0;
      }
      .robot-config-switcher__button:hover,
      .recording-mode-rail__button:hover {
        transform: translateY(-1px);
        border-color: rgba(28, 27, 25, 0.16);
      }
      .robot-config-switcher__button:active,
      .recording-mode-rail__button:active {
        transform: translateY(0);
      }
      .robot-config-switcher__button.active {
        background: #FFFFFF;
        border-color: rgba(var(--robot-accent-rgb), 0.28);
        box-shadow: 0 12px 24px rgba(var(--robot-accent-rgb), 0.14);
      }
      .recording-mode-rail__button.active {
        background: #FFFFFF;
        border-color: rgba(28, 27, 25, 0.14);
        box-shadow: 0 12px 24px rgba(17, 17, 16, 0.1);
      }
      .robot-config-switcher__swatch {
        width: 18px;
        height: 18px;
        border-radius: 999px;
        flex-shrink: 0;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
      }
      .robot-config-switcher__name {
        display: block;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.2;
        letter-spacing: -0.02em;
        color: inherit;
      }
      .robot-config-switcher__button.active .robot-config-switcher__name {
        color: var(--robot-accent);
      }
      .recording-mode-rail__button.active .recording-mode-rail__eyebrow {
        color: #6B6960;
      }
      .robot-config-switcher__hint {
        margin: 0;
        padding-top: 0;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 12px;
        line-height: 1.5;
        color: #6B6960;
      }
      .recording-mode-rail__eyebrow {
        display: block;
        margin-bottom: 3px;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #8B887E;
      }
      .recording-mode-rail__label {
        display: block;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.25;
        letter-spacing: -0.02em;
        color: #1C1B19;
        white-space: normal;
        overflow-wrap: anywhere;
      }
      .page-overview {
        position: relative;
        width: 100%;
        border-radius: 24px;
        border: 1px solid rgba(28, 27, 25, 0.08);
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(248, 246, 241, 0.84)),
          rgba(255, 255, 255, 0.82);
        backdrop-filter: blur(16px);
        box-shadow: 0 18px 36px rgba(17, 17, 16, 0.12);
        overflow: hidden;
      }
      .page-overview__toggle {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 14px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
      }
      .page-overview__toggle-copy {
        min-width: 0;
      }
      .page-overview__toggle-kicker {
        display: block;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #7A776F;
        margin-bottom: 4px;
      }
      .page-overview__toggle-title {
        display: block;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: -0.03em;
        color: #1C1B19;
      }
      .page-overview__toggle-icon {
        width: 28px;
        height: 28px;
        border-radius: 999px;
        border: 1px solid rgba(28, 27, 25, 0.08);
        background: rgba(244, 242, 237, 0.86);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: transform 0.16s ease;
      }
      .page-overview.open .page-overview__toggle-icon {
        transform: rotate(45deg);
      }
      .page-overview__panel {
        display: none;
        width: 100%;
        padding: 0 14px 14px;
      }
      .page-overview.open .page-overview__panel {
        display: block;
      }
      .page-overview__rows {
        display: grid;
        gap: 10px;
      }
      .page-overview__row {
        padding-top: 10px;
        border-top: 1px solid rgba(28, 27, 25, 0.08);
      }
      .page-overview__row:first-child {
        padding-top: 0;
        border-top: none;
      }
      .page-overview__label {
        display: inline-block;
        margin-bottom: 4px;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #6B6960;
      }
      .page-overview__copy {
        margin: 0;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 13px;
        line-height: 1.5;
        color: #3F3D38;
      }
      .app-intro-overlay {
        position: fixed;
        inset: 0;
        z-index: 260;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 28px;
        background:
          radial-gradient(circle at top, rgba(var(--robot-accent-rgb), 0.14) 0%, rgba(17, 17, 16, 0) 34%),
          linear-gradient(180deg, rgba(17, 17, 16, 0.38), rgba(17, 17, 16, 0.5));
        backdrop-filter: blur(12px);
      }
      .app-intro-overlay__card {
        position: relative;
        width: min(760px, calc(100vw - 32px));
        min-height: min(500px, calc(100vh - 56px));
        border-radius: 34px;
        border: 1px solid rgba(28, 27, 25, 0.08);
        background:
          linear-gradient(180deg, rgba(250, 248, 244, 0.98), rgba(241, 237, 230, 0.96));
        box-shadow: 0 34px 90px rgba(17, 17, 16, 0.2);
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.85fr);
        overflow: hidden;
      }
      .app-intro-overlay__content {
        padding: 42px 40px 82px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
      }
      .app-intro-overlay__kicker {
        margin: 0 0 18px;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: rgba(var(--robot-accent-rgb), 0.82);
      }
      .app-intro-overlay__title {
        margin: 0 0 16px;
        max-width: 420px;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: clamp(34px, 4vw, 46px);
        font-weight: 600;
        line-height: 0.98;
        letter-spacing: -0.06em;
        color: #1C1B19;
      }
      .app-intro-overlay__body {
        max-width: 430px;
        display: grid;
        gap: 12px;
      }
      .app-intro-overlay__copy {
        margin: 0;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 14px;
        line-height: 1.72;
        color: #4B4943;
      }
      .app-intro-overlay__actions {
        margin-top: auto;
        display: flex;
        align-items: center;
        gap: 10px;
        padding-top: 26px;
      }
      .app-intro-overlay__action {
        padding: 13px 20px;
        border: 1px solid rgba(17, 17, 16, 0.08);
        border-radius: 999px;
        background: #1C1B19;
        color: #FFFFFF;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: -0.02em;
        cursor: pointer;
        box-shadow: 0 12px 30px rgba(17, 17, 16, 0.14);
        transition: transform 0.14s ease, box-shadow 0.14s ease;
      }
      .app-intro-overlay__action:hover {
        transform: translateY(-1px);
        box-shadow: 0 14px 34px rgba(17, 17, 16, 0.16);
      }
      .app-intro-overlay__brand-panel {
        position: relative;
        padding: 28px 28px 82px;
        border-left: 1px solid rgba(28, 27, 25, 0.08);
        background:
          radial-gradient(circle at center, rgba(var(--robot-accent-rgb), 0.12) 0%, rgba(var(--robot-accent-rgb), 0) 72%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.46), rgba(232, 228, 221, 0.9));
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      .app-intro-overlay__brand-note {
        margin: 0 0 18px;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #7A776F;
      }
      .app-intro-overlay__logo-frame {
        width: min(100%, 236px);
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 30px;
        border: 1px solid rgba(28, 27, 25, 0.08);
        background: rgba(255, 255, 255, 0.74);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
      }
      .app-intro-overlay__logo-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 30px;
      }
      .app-intro-overlay__logo {
        width: min(170px, 74%);
        display: block;
        transition: transform 0.16s ease;
      }
      .app-intro-overlay__logo-link:hover .app-intro-overlay__logo {
        transform: translateY(-2px) scale(1.01);
      }
      .app-intro-overlay__meta {
        width: min(100%, 260px);
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid rgba(28, 27, 25, 0.08);
        display: grid;
        gap: 10px;
      }
      .app-intro-overlay__meta-row {
        display: grid;
        gap: 4px;
      }
      .app-intro-overlay__meta-label {
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #8A877D;
      }
      .app-intro-overlay__meta-value {
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 13px;
        line-height: 1.4;
        color: #2F2D29;
      }
      .app-intro-overlay__signature {
        position: absolute;
        right: 24px;
        bottom: 20px;
        font-family: 'Geist', -apple-system, sans-serif;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: -0.02em;
        color: #1C1B19;
        text-decoration: none;
        transition: color 0.16s ease;
      }
      .app-intro-overlay__signature:hover {
        color: ${APP_BUTTON_YELLOW};
      }
      @media (max-width: 880px) {
        .preview-support-stack {
          left: 12px;
          bottom: 12px;
          width: min(320px, calc(100vw - 24px));
        }
        .preview-control-dock__title {
          font-size: 17px;
        }
        .preview-control-dock__toggle {
          padding: 13px 14px;
        }
        .preview-control-dock__panel {
          padding: 0 14px 14px;
        }
        .robot-config-switcher__grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .robot-config-switcher__button,
        .recording-mode-rail__button {
          padding: 10px 11px;
        }
        .page-overview__toggle {
          padding: 11px 12px;
        }
        .page-overview__panel {
          padding: 0 12px 12px;
        }
        .app-intro-overlay {
          padding: 12px;
        }
        .app-intro-overlay__card {
          min-height: min(520px, calc(100vh - 24px));
          grid-template-columns: 1fr;
          border-radius: 24px;
        }
        .app-intro-overlay__content {
          padding: 24px 22px 72px;
        }
        .app-intro-overlay__title {
          max-width: none;
          font-size: clamp(28px, 8vw, 36px);
        }
        .app-intro-overlay__body {
          max-width: none;
        }
        .app-intro-overlay__brand-panel {
          padding: 22px 22px 18px;
          border-left: none;
          border-top: 1px solid rgba(28, 27, 25, 0.08);
          order: -1;
        }
        .app-intro-overlay__brand-note {
          margin-bottom: 14px;
        }
        .app-intro-overlay__logo-frame {
          width: min(100%, 188px);
          border-radius: 24px;
        }
        .app-intro-overlay__logo-link {
          border-radius: 24px;
        }
        .app-intro-overlay__logo {
          width: min(156px, 72%);
        }
        .app-intro-overlay__meta {
          width: 100%;
          max-width: 300px;
          margin-top: 16px;
          padding-top: 14px;
        }
        .app-intro-overlay__copy {
          font-size: 13px;
        }
        .app-intro-overlay__signature {
          right: 18px;
          bottom: 16px;
          font-size: 13px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensurePreviewSupportStack() {
    if (!document.body) return null;

    let stack = document.getElementById('preview-support-stack');
    if (stack) return stack;

    stack = document.createElement('div');
    stack.id = 'preview-support-stack';
    stack.className = 'preview-support-stack';
    stack.setAttribute('aria-label', 'Preview controls and overview');
    document.body.appendChild(stack);
    return stack;
  }

  function ensureControlDock() {
    const stack = ensurePreviewSupportStack();
    if (!stack) return null;

    let dock = document.getElementById('preview-control-dock');
    if (dock) return dock;

    dock = document.createElement('aside');
    dock.id = 'preview-control-dock';
    dock.className = 'preview-control-dock';
    dock.setAttribute('aria-label', 'Concept preview controls');
    dock.innerHTML = `
      <button class="preview-control-dock__toggle" type="button" aria-expanded="false" aria-controls="preview-control-dock-panel">
        <span class="preview-control-dock__toggle-copy">
          <span class="preview-control-dock__toggle-kicker">Concept Preview</span>
          <span class="preview-control-dock__toggle-title">Journey + Memo Hat</span>
        </span>
        <span class="preview-control-dock__toggle-icon" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#1C1B19" stroke-width="1.8" stroke-linecap="round">
            <line x1="6" y1="1.5" x2="6" y2="10.5"></line>
            <line x1="1.5" y1="6" x2="10.5" y2="6"></line>
          </svg>
        </span>
      </button>
      <div class="preview-control-dock__panel" id="preview-control-dock-panel">
        <div class="preview-control-dock__header">
          <div class="preview-control-dock__eyebrow">Concept Preview</div>
          <div class="preview-control-dock__title">Choose a journey and Memo hat</div>
          <p class="preview-control-dock__copy">Pick where the recording starts and keep the same color scheme across the entire concept.</p>
        </div>
        <div class="preview-control-dock__sections"></div>
      </div>
    `;

    const toggle = dock.querySelector('.preview-control-dock__toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const open = dock.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }

    stack.appendChild(dock);
    return dock;
  }

  function enhanceScreenBranding() {
    document.querySelectorAll('.recording-brand').forEach((brand) => {
      brand.removeAttribute('aria-hidden');
      const logoWrap = brand.querySelector('.recording-logo-wrap');
      if (!logoWrap) return;

      let link = logoWrap.querySelector('.recording-logo-link');
      if (!link) {
        link = document.createElement('a');
        link.className = 'recording-logo-link';
        while (logoWrap.firstChild) {
          link.appendChild(logoWrap.firstChild);
        }
        logoWrap.appendChild(link);
      }

      link.href = SUNDAY_URL;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.setAttribute('aria-label', 'Open Sunday.ai');
    });

    document.querySelectorAll('.recording-credit').forEach((credit) => {
      credit.removeAttribute('aria-hidden');
      const name = credit.querySelector('.recording-credit-name');
      if (!name) return;

      if (name.tagName === 'A') {
        name.href = STEYN_LINKEDIN_URL;
        name.target = '_blank';
        name.rel = 'noreferrer';
        name.setAttribute('aria-label', 'Open Steyn Knollema on LinkedIn');
        name.classList.add('recording-credit-link');
        return;
      }

      const link = document.createElement('a');
      link.className = `${name.className} recording-credit-link`;
      link.href = STEYN_LINKEDIN_URL;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = name.textContent.trim();
      link.setAttribute('aria-label', 'Open Steyn Knollema on LinkedIn');
      name.replaceWith(link);
    });
  }

  function createButton(configKey) {
    const config = CONFIGS[configKey];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'robot-config-switcher__button';
    button.dataset.robotConfigButton = configKey;
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', config.label);
    button.title = config.label;
    button.innerHTML = `
      <span class="robot-config-switcher__swatch" style="background:${config.accent}"></span>
      <span class="robot-config-switcher__name">${config.label}</span>
    `;
    button.addEventListener('click', () => setConfig(configKey));
    return button;
  }

  function injectSwitcher() {
    const dock = ensureControlDock();
    if (!dock) return;

    document.querySelectorAll('#robot-config-switcher, [data-robot-config-root="true"]').forEach((node) => {
      node.remove();
    });

    const switcher = document.createElement('section');
    switcher.id = 'robot-config-switcher';
    switcher.className = 'robot-config-switcher';
    switcher.dataset.robotConfigRoot = 'true';
    switcher.setAttribute('aria-label', 'Robot configuration preview');

    const label = document.createElement('div');
    label.className = 'robot-config-switcher__label';
    label.textContent = 'Memo Hat';

    const grid = document.createElement('div');
    grid.className = 'robot-config-switcher__grid';
    Object.keys(CONFIGS).forEach((configKey) => {
      grid.appendChild(createButton(configKey));
    });

    const hint = document.createElement('div');
    hint.className = 'robot-config-switcher__hint';
    hint.textContent = "Memo wears many hats, Customize your app according to memo's hat";

    switcher.appendChild(label);
    switcher.appendChild(hint);
    switcher.appendChild(grid);
    dock.querySelector('.preview-control-dock__sections').appendChild(switcher);
    updateActiveButtons();
  }

  function updateModeRailState() {
    const currentPage = getCurrentPageKey();
    document.querySelectorAll('[data-recording-mode-button]').forEach((button) => {
      const mode = button.dataset.recordingModeButton;
      const active = mode === 'onboarding' ? currentPage === ONBOARDING_PAGE : isAppPage();
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function injectModeRail() {
    const dock = ensureControlDock();
    if (!dock) return;

    document.querySelectorAll('#recording-mode-rail, [data-recording-mode-root="true"]').forEach((node) => {
      node.remove();
    });

    const rail = document.createElement('section');
    rail.id = 'recording-mode-rail';
    rail.className = 'recording-mode-rail';
    rail.dataset.recordingModeRoot = 'true';
    rail.setAttribute('aria-label', 'Recording navigation');

    const title = document.createElement('div');
    title.className = 'recording-mode-rail__title';
    title.textContent = 'Journey';

    const grid = document.createElement('div');
    grid.className = 'recording-mode-rail__grid';

    const options = [
      { key: 'onboarding', label: 'Onboarding', eyebrow: 'Start', path: ONBOARDING_PAGE },
      { key: 'app', label: 'App', eyebrow: 'Jump', path: APP_HOME_PAGE }
    ];

    options.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'recording-mode-rail__button';
      button.dataset.recordingModeButton = option.key;
      button.setAttribute('aria-pressed', 'false');
      button.innerHTML = `
        <span class="recording-mode-rail__eyebrow">${option.eyebrow}</span>
        <span class="recording-mode-rail__label">${option.label}</span>
      `;
      button.addEventListener('click', () => navigate(option.path));
      grid.appendChild(button);
    });

    rail.appendChild(title);
    rail.appendChild(grid);
    dock.querySelector('.preview-control-dock__sections').prepend(rail);
    updateModeRailState();
  }

  function injectPageOverview() {
    const stack = ensurePreviewSupportStack();
    if (!stack) return;

    document.querySelectorAll('#page-overview, [data-page-overview-root="true"]').forEach((node) => {
      node.remove();
    });

    const overview = PAGE_OVERVIEWS[getCurrentPageKey()];
    if (!overview) return;

    const panelId = `page-overview-panel-${getCurrentPageKey().replace(/[^a-z0-9]+/g, '-')}`;
    const card = document.createElement('aside');
    card.id = 'page-overview';
    card.className = 'page-overview';
    card.dataset.pageOverviewRoot = 'true';
    card.setAttribute('aria-label', `${overview.title} page overview`);
    card.innerHTML = `
      <button class="page-overview__toggle" type="button" aria-expanded="false" aria-controls="${panelId}">
        <span class="page-overview__toggle-copy">
          <span class="page-overview__toggle-kicker">Page Overview</span>
          <span class="page-overview__toggle-title">${overview.title}</span>
        </span>
        <span class="page-overview__toggle-icon" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#1C1B19" stroke-width="1.8" stroke-linecap="round">
            <line x1="6" y1="1.5" x2="6" y2="10.5"></line>
            <line x1="1.5" y1="6" x2="10.5" y2="6"></line>
          </svg>
        </span>
      </button>
      <div class="page-overview__panel" id="${panelId}">
        <div class="page-overview__rows">
          <div class="page-overview__row">
            <div class="page-overview__label">Idea</div>
            <p class="page-overview__copy">${overview.idea}</p>
          </div>
          <div class="page-overview__row">
            <div class="page-overview__label">Elements</div>
            <p class="page-overview__copy">${overview.elements}</p>
          </div>
          <div class="page-overview__row">
            <div class="page-overview__label">Why</div>
            <p class="page-overview__copy">${overview.why}</p>
          </div>
          <div class="page-overview__row">
            <div class="page-overview__label">Design Choice</div>
            <p class="page-overview__copy">${overview.choices}</p>
          </div>
        </div>
      </div>
    `;
    const toggle = card.querySelector('.page-overview__toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const open = card.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
    stack.appendChild(card);
  }

  function dismissAppIntroOverlay() {
    markAppIntroSeen();
    document.querySelectorAll('#app-intro-overlay, [data-app-intro-root="true"]').forEach((node) => {
      node.remove();
    });
  }

  function injectAppIntroOverlay() {
    if (!document.body || !isAppPage() || hasSeenAppIntro()) return;

    document.querySelectorAll('#app-intro-overlay, [data-app-intro-root="true"]').forEach((node) => {
      node.remove();
    });

    const overlay = document.createElement('div');
    overlay.id = 'app-intro-overlay';
    overlay.className = 'app-intro-overlay';
    overlay.dataset.appIntroRoot = 'true';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Sunday Robotics introduction');
    overlay.innerHTML = `
      <div class="app-intro-overlay__card">
        <section class="app-intro-overlay__content">
          <div class="app-intro-overlay__kicker">Memo Communication App Concept</div>
          <h2 class="app-intro-overlay__title">A clearer, consumer-facing layer for Memo.</h2>
          <div class="app-intro-overlay__body">
            <p class="app-intro-overlay__copy">This is a concept idea of a consumer-facing Memo communication app, developed as an interest project around the work Sunday Robotics has been doing.</p>
            <p class="app-intro-overlay__copy">It explores how onboarding, home, skills, scheduling, activity, mapping, and settings could feel like one calm communication layer that is easier for everyday users to understand and act on.</p>
          </div>
          <div class="app-intro-overlay__actions">
            <button class="app-intro-overlay__action" type="button">Enter App</button>
          </div>
        </section>
        <aside class="app-intro-overlay__brand-panel">
          <div class="app-intro-overlay__brand-note">Inspired by Sunday Robotics</div>
          <div class="app-intro-overlay__logo-frame">
            <a class="app-intro-overlay__logo-link" href="${SUNDAY_URL}" target="_blank" rel="noreferrer" aria-label="Open Sunday.ai">
              <img class="app-intro-overlay__logo" src="Untitled%20design(12).png" alt="Sunday Robotics">
            </a>
          </div>
          <div class="app-intro-overlay__meta">
            <div class="app-intro-overlay__meta-row">
              <div class="app-intro-overlay__meta-label">Type</div>
              <div class="app-intro-overlay__meta-value">Consumer-facing concept study</div>
            </div>
            <div class="app-intro-overlay__meta-row">
              <div class="app-intro-overlay__meta-label">Scope</div>
              <div class="app-intro-overlay__meta-value">From first-time onboarding to daily planning, activity, and control</div>
            </div>
          </div>
        </aside>
        <a class="app-intro-overlay__signature" href="${STEYN_LINKEDIN_URL}" target="_blank" rel="noreferrer" aria-label="Open Steyn Knollema on LinkedIn">~Steyn Knollema</a>
      </div>
    `;

    const action = overlay.querySelector('.app-intro-overlay__action');
    if (action) {
      action.addEventListener('click', dismissAppIntroOverlay);
    }

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        dismissAppIntroOverlay();
      }
    });

    document.body.appendChild(overlay);
  }

  window.getRobotConfig = getConfig;
  window.withRobotConfig = withConfig;
  window.navigateWithConfig = navigate;
  window.setRobotConfig = setConfig;

  injectStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindInternalNavigation();
      rewriteInternalLinks();
      enhanceScreenBranding();
      injectModeRail();
      injectSwitcher();
      injectPageOverview();
      updateConfigImages();
      updateConfigBackgrounds();
      injectAppIntroOverlay();
    }, { once: true });
  } else {
    bindInternalNavigation();
    rewriteInternalLinks();
    enhanceScreenBranding();
    injectModeRail();
    injectSwitcher();
    injectPageOverview();
    updateConfigImages();
    updateConfigBackgrounds();
    injectAppIntroOverlay();
  }

  setConfig(activeConfig, { syncUrl: true });
})();

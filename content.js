/**
 * KU Elearn Dark Mode — minimal script
 * Only toggles a class and adds the sidebar switch.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'ku_dark_mode_enabled';
  const BTN_ID = 'ku-darkmode-btn';

  const ICON_MOON = `<svg class="ku-dm-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" fill="currentColor"/></svg>`;
  const ICON_SUN = `<svg class="ku-dm-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill="currentColor"/></svg>`;

  let isDarkMode = false;

  function loadPreference() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  function savePreference(enabled) {
    try {
      window.localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
    } catch {}
  }

  function updateButton() {
    const btn = document.getElementById(BTN_ID);
    if (!btn) return;
    const icon = btn.querySelector('.ku-dm-icon-container');
    btn.setAttribute('aria-pressed', isDarkMode ? 'true' : 'false');
    if (icon) icon.innerHTML = isDarkMode ? ICON_SUN : ICON_MOON;
  }

  function applyDarkMode(enabled) {
    isDarkMode = enabled;
    document.documentElement.classList.toggle('ku-dark-mode', enabled);
    updateButton();
  }

  function toggleDarkMode() {
    applyDarkMode(!isDarkMode);
    savePreference(isDarkMode);
  }

  function createButton() {
    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.type = 'button';
    btn.setAttribute('role', 'switch');
    btn.innerHTML = `
      <span class="ku-dm-icon-container" aria-hidden="true">${isDarkMode ? ICON_SUN : ICON_MOON}</span>
      <span class="ku-dm-label">Dark Mode</span>
      <span class="ku-dm-pill" aria-hidden="true"></span>
    `;
    btn.addEventListener('click', toggleDarkMode);
    return btn;
  }

  function injectButton() {
    if (document.getElementById(BTN_ID)) return true;

    let target = document.querySelector('[class*="makeStylesfooter"]');
    if (!target) target = document.querySelector('#base_tools');
    if (!target) target = document.querySelector('base-side-menu nav');
    if (!target) return false;

    const btn = createButton();
    if (target.matches && target.matches('[class*="makeStylesfooter"]')) {
      target.insertBefore(btn, target.firstChild);
    } else {
      const li = document.createElement('li');
      li.style.cssText = 'list-style:none;display:block;';
      li.appendChild(btn);
      target.appendChild(li);
    }
    return true;
  }

  function init() {
    applyDarkMode(loadPreference());
    if (injectButton()) return;

    const observer = new MutationObserver(() => {
      injectButton();
    });
    observer.observe(document.body, {childList: true, subtree: true});
    setTimeout(() => observer.disconnect(), 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

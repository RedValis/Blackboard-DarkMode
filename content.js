/**
 * KU Elearn Dark Mode — minimal script
 * Only toggles a class and adds the sidebar switch.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'ku_dark_mode_enabled';
  const BTN_ID = 'ku-darkmode-btn';
  const CLASSIC_HOME_SHORTCUT_ITEM_ID = 'ku-course-menu-home-shortcut-item';
  const CLASSIC_HOME_SHORTCUT_LINK_ID = 'ku-course-menu-home-shortcut';
  const MESSAGE_TOOLTIP_ATTR = 'data-ku-tooltip';
  const MESSAGE_TOOLTIP_TITLE_ATTR = 'data-ku-original-title';

  const ICON_MOON = `<svg class="ku-dm-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" fill="currentColor"/></svg>`;
  const ICON_SUN = `<svg class="ku-dm-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill="currentColor"/></svg>`;
  const ICON_HOME = `<svg class="ku-course-menu-home-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M2.5 6.4 8 2l5.5 4.4V13a1 1 0 0 1-1 1H9.5V9.5h-3V14h-3a1 1 0 0 1-1-1V6.4Z" fill="currentColor"/></svg>`;

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

  function isTopWindow() {
    try {
      return window.top === window;
    } catch {
      return false;
    }
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
    syncClassicCourseMenuHomeShortcutVisibility();
    syncMessageEditorTooltips();
    updateButton();
  }

  function toggleDarkMode() {
    applyDarkMode(!isDarkMode);
    savePreference(isDarkMode);
  }

  function handleStorageSync(event) {
    if (event.key !== STORAGE_KEY) return;
    applyDarkMode(event.newValue === 'true');
  }

  function getClassicCourseMenuNodes() {
    return {
      originalHome: document.querySelector('#courseMenuPalette #homeicon'),
      actionList: document.querySelector('#courseMenuPalette .actionBarMicro ul.u_floatThis-right'),
      refreshItem: document.getElementById('refreshMenuLink')
    };
  }

  function syncClassicCourseMenuHomeShortcutVisibility() {
    const originalHome = document.querySelector('#courseMenuPalette #homeicon[data-ku-homeicon-original="true"]');
    const shortcutItem = document.getElementById(CLASSIC_HOME_SHORTCUT_ITEM_ID);

    if (shortcutItem) {
      shortcutItem.hidden = !isDarkMode;
    }

    if (originalHome) {
      if (isDarkMode) {
        originalHome.setAttribute('aria-hidden', 'true');
        originalHome.setAttribute('tabindex', '-1');
      } else {
        originalHome.removeAttribute('aria-hidden');
        originalHome.removeAttribute('tabindex');
      }
    }
  }

  function ensureClassicCourseMenuHomeShortcut() {
    const { originalHome, actionList, refreshItem } = getClassicCourseMenuNodes();
    if (!originalHome || !actionList) return false;

    originalHome.setAttribute('data-ku-homeicon-original', 'true');

    let shortcutItem = document.getElementById(CLASSIC_HOME_SHORTCUT_ITEM_ID);
    if (!shortcutItem) {
      shortcutItem = document.createElement('li');
      shortcutItem.id = CLASSIC_HOME_SHORTCUT_ITEM_ID;
      shortcutItem.className = 'secondaryButton ku-course-menu-home-shortcut-item';

      const shortcutLink = document.createElement('a');
      shortcutLink.id = CLASSIC_HOME_SHORTCUT_LINK_ID;
      shortcutLink.className = 'ku-course-menu-home-shortcut';
      shortcutLink.setAttribute('role', 'button');
      shortcutItem.appendChild(shortcutLink);

      actionList.insertBefore(shortcutItem, refreshItem || actionList.firstChild);
    }

    const shortcutLink = shortcutItem.querySelector('a');
    if (shortcutLink) {
      const href = originalHome.getAttribute('href') || '#';
      const title = originalHome.getAttribute('title') || 'Go to Course Entry Page';
      shortcutLink.setAttribute('href', href);
      shortcutLink.setAttribute('title', title);
      shortcutLink.setAttribute('aria-label', title);

      const target = originalHome.getAttribute('target');
      if (target) {
        shortcutLink.setAttribute('target', target);
      } else {
        shortcutLink.removeAttribute('target');
      }

      shortcutLink.innerHTML = `<span class="ku-course-menu-home-shortcut-icon" aria-hidden="true">${ICON_HOME}</span>`;
    }

    syncClassicCourseMenuHomeShortcutVisibility();
    return true;
  }

  function initClassicCourseMenuHomeShortcut() {
    if (ensureClassicCourseMenuHomeShortcut()) return;

    const observer = new MutationObserver(() => {
      ensureClassicCourseMenuHomeShortcut();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 30000);
  }

  function stripMessageToolbarTitles(button) {
    if (!button) return;

    const originalTitle = button.getAttribute(MESSAGE_TOOLTIP_TITLE_ATTR) || button.getAttribute('title') || button.getAttribute('aria-label') || '';
    if (originalTitle) {
      button.setAttribute(MESSAGE_TOOLTIP_ATTR, originalTitle);
      button.setAttribute(MESSAGE_TOOLTIP_TITLE_ATTR, originalTitle);
    }

    const titledNodes = [button, ...button.querySelectorAll('[title]')];
    titledNodes.forEach((node) => {
      const nodeTitle = node.getAttribute('title');
      if (nodeTitle) {
        node.setAttribute(MESSAGE_TOOLTIP_TITLE_ATTR, nodeTitle);
        node.removeAttribute('title');
      }
    });
  }

  function restoreMessageToolbarTitles(button) {
    if (!button) return;

    button.removeAttribute(MESSAGE_TOOLTIP_ATTR);
    if (button.hasAttribute(MESSAGE_TOOLTIP_TITLE_ATTR)) {
      button.setAttribute('title', button.getAttribute(MESSAGE_TOOLTIP_TITLE_ATTR) || '');
    }

    const titledNodes = [button, ...button.querySelectorAll(`[${MESSAGE_TOOLTIP_TITLE_ATTR}]`)];
    titledNodes.forEach((node) => {
      if (node === button) return;
      const originalTitle = node.getAttribute(MESSAGE_TOOLTIP_TITLE_ATTR);
      if (originalTitle) {
        node.setAttribute('title', originalTitle);
      }
    });
  }

  function syncMessageEditorTooltips() {
    const buttons = document.querySelectorAll('.message-panel .bb-editor-toolbar-button');
    buttons.forEach((button) => {
      if (isDarkMode) {
        stripMessageToolbarTitles(button);
      } else {
        restoreMessageToolbarTitles(button);
      }
    });
  }

  function initMessageEditorTooltips() {
    syncMessageEditorTooltips();

    document.addEventListener('mouseover', (event) => {
      if (!isDarkMode) return;
      stripMessageToolbarTitles(event.target.closest('.message-panel .bb-editor-toolbar-button'));
    }, true);

    document.addEventListener('focusin', (event) => {
      if (!isDarkMode) return;
      stripMessageToolbarTitles(event.target.closest('.message-panel .bb-editor-toolbar-button'));
    }, true);

    const observer = new MutationObserver(() => {
      syncMessageEditorTooltips();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 30000);
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
    window.addEventListener('storage', handleStorageSync);
    initClassicCourseMenuHomeShortcut();
    initMessageEditorTooltips();

    if (!isTopWindow()) return;

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

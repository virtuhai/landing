/**
 * i18n.js — Lightweight static-site English / Ukrainian localisation.
 * English is the source content in index.html. The Ukrainian dictionary
 * replaces matching text nodes, so components remain independent.
 */

import { CONFIG } from '../config.js?v=20260724-2';

const originalTexts = new Map();
const originalTitle = document.title;
// index.html is authored in English. Keep this separate from the preferred
// default locale so the Ukrainian dictionary is loaded on a first visit.
let activeLanguage = 'en';

function updateToggleState(language) {
  document.querySelectorAll('[data-language-option]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.languageOption === language));
  });
}

function shouldTranslate(node) {
  const parent = node.parentElement;
  return parent && !parent.closest('script, style, svg, title');
}

function replaceText(dictionary) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    if (shouldTranslate(node)) {
      const source = originalTexts.get(node) ?? node.nodeValue;
      originalTexts.set(node, source);
      const key = source.trim();
      const translation = dictionary[key];

      if (translation) {
        node.nodeValue = source.replace(key, translation);
      } else {
        node.nodeValue = source;
      }
    }
    node = walker.nextNode();
  }
}

async function loadDictionary(language) {
  if (language === 'en') return { strings: {}, title: originalTitle };

  const response = await fetch(`data/i18n/${language}.json`);
  if (!response.ok) throw new Error('Translation file unavailable');
  return response.json();
}

async function setLanguage(language) {
  if (!['en', 'uk'].includes(language)) return;

  try {
    const dictionary = await loadDictionary(language);
    replaceText(dictionary.strings ?? {});
    document.title = dictionary.title ?? originalTitle;
    activeLanguage = language;
    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;
    localStorage.setItem(CONFIG.locale.storageKey, language);
    updateToggleState(language);
  } catch (error) {
    // Keep English source content visible if a translation file cannot load.
    if (language === 'en') return;
    replaceText({});
    document.documentElement.lang = 'en';
    document.documentElement.dataset.language = 'en';
    updateToggleState('en');
  }
}

/** Initialise language controls and restore the visitor's saved choice. */
export function initI18n() {
  const storedLanguage = localStorage.getItem(CONFIG.locale.storageKey);
  const initialLanguage = ['en', 'uk'].includes(storedLanguage)
    ? storedLanguage
    : CONFIG.locale.default;

  document.querySelectorAll('[data-language-option]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.languageOption));
  });

  updateToggleState(initialLanguage);
  if (initialLanguage !== activeLanguage) setLanguage(initialLanguage);
}

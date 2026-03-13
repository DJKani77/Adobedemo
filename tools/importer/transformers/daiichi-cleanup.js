/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Daiichi Sankyo site-wide cleanup.
 * Uses a positive-selection approach: extract only <main> content,
 * discarding header, footer, cookie consent, and all other site chrome.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    const { document } = payload;

    // POSITIVE SELECTION: Keep only <main> content, discard everything else.
    // This is more robust than trying to remove every unwanted element by selector,
    // because the live page DOM may differ from our scraped version.
    const mainEl = element.querySelector('main, main.main, [role="main"]');
    if (mainEl) {
      // Remove everything from body, then re-add only <main>
      while (element.firstChild) element.removeChild(element.firstChild);
      element.appendChild(mainEl);
    }

    // Remove elements inside <main> that are NOT authorable content
    WebImporter.DOMUtils.remove(element, [
      // Upper footer section (inside <main> on this site)
      '.upper-footer',
      // Cookie warnings embedded in content area
      '.youtube-cookie-warning__content',
      // Any nav elements that might be inside main
      'nav',
      '.section-megamenu',
      // Non-content elements
      'noscript',
      'link',
    ]);

    // Remove slick-cloned slides (duplicates created by slick slider)
    const cloned = element.querySelectorAll('.slick-cloned');
    cloned.forEach((el) => el.remove());

    // Remove slick navigation buttons (not authorable content)
    WebImporter.DOMUtils.remove(element, ['.slick-prev', '.slick-next']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Second-pass cleanup for any dynamic elements that appeared after block parsing
    WebImporter.DOMUtils.remove(element, [
      '.upper-footer',
      'nav',
      '.section-megamenu',
    ]);
  }
}

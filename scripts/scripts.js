import {
  buildBlock,
  decorateBlock,
  loadBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateLinkedPictures,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  getMetadata,
} from './aem.js';

/**
 * Moves attributes from one element to another.
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from one element to another.
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * Case-insensitive metadata lookup (handles local dev server preserving case).
 */
function getMetadataCI(name) {
  const value = getMetadata(name);
  if (value) return value;
  const meta = [...document.head.querySelectorAll('meta')].find(
    (m) => (m.getAttribute('name') || '').toLowerCase() === name.toLowerCase(),
  );
  return meta ? meta.content : '';
}

/**
 * Loads a template-specific header block.
 */
async function loadTemplateHeader(header) {
  const template = getMetadataCI('template');
  const blockName = template ? `header-${template}` : 'header';
  const headerBlock = buildBlock(blockName, '');
  header.append(headerBlock);
  decorateBlock(headerBlock);
  return loadBlock(headerBlock);
}

/**
 * Loads a template-specific footer block.
 */
async function loadTemplateFooter(footer) {
  const template = getMetadataCI('template');
  const blockName = template ? `footer-${template}` : 'footer';
  const footerBlock = buildBlock(blockName, '');
  footer.append(footerBlock);
  decorateBlock(footerBlock);
  return loadBlock(footerBlock);
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
export function decorateMain(main) {
  decorateButtons(main);
  decorateIcons(main);
  decorateLinkedPictures(main);
  decorateSections(main);
  decorateBlocks(main);
}

async function loadEager(doc) {
  document.documentElement.lang = 'de';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }
}

async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  const template = getMetadataCI('template');
  if (template) {
    loadTemplateHeader(doc.querySelector('header'));
    loadTemplateFooter(doc.querySelector('footer'));
  } else {
    loadHeader(doc.querySelector('header'));
    loadFooter(doc.querySelector('footer'));
  }

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
}

function loadDelayed() {
  window.setTimeout(() => {
    // delayed loading placeholder
  }, 3000);
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

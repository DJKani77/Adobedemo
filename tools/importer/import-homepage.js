/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for the homepage template
import carouselDaichiParser from './parsers/carousel-daiichi.js';
import embedDaichiParser from './parsers/embed-daiichi.js';
import cardsDaichiParser from './parsers/cards-daiichi.js';

// TRANSFORMER IMPORTS - Import all transformers for Daiichi Sankyo site
import cleanupTransformer from './transformers/daiichi-cleanup.js';
import sectionsTransformer from './transformers/daiichi-sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'carousel-daiichi': carouselDaichiParser,
  'embed-daiichi': embedDaichiParser,
  'cards-daiichi': cardsDaichiParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Daiichi Sankyo Germany corporate homepage with hero, news, therapy areas, and company information',
  urls: [
    'https://www.daiichi-sankyo.de',
  ],
  blocks: [
    {
      name: 'carousel-daiichi',
      instances: ['#frontSlider'],
    },
    {
      name: 'embed-daiichi',
      instances: ['.wrap-content-1000 > .frame-type-textmedia.frame-layout-TextmediaAsCard'],
    },
    {
      name: 'cards-daiichi',
      instances: ['.frame-type-columnsTwo'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Slider',
      selector: 'main > .wrap-content-1280',
      style: null,
      blocks: ['carousel-daiichi'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Company Info',
      selector: 'main > .page__info--section-content',
      style: null,
      blocks: ['embed-daiichi', 'cards-daiichi'],
      defaultContent: ['.frame-type-textmedia.frame-layout-Textmedia'],
    },
  ],
};

// TRANSFORMER REGISTRY - Array of transformer functions
// Section transformer runs after cleanup (in afterTransform hook) to add <hr> between sections
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};

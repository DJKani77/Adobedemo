var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-daiichi.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".slick-slide:not(.slick-cloned)");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector('img.slider-section-image, img[class*="slider-section-image"]');
      const titleEl = slide.querySelector(".slider-section .title, .title");
      const titleText = titleEl ? titleEl.textContent.trim() : "";
      const ctaLink = slide.querySelector(".wrap-buttons a, .wrap_decoration_link a");
      const imageCell = [];
      if (img) {
        imageCell.push(img);
      }
      const contentCell = [];
      if (titleText) {
        const heading = document.createElement("h2");
        heading.textContent = titleText;
        contentCell.push(heading);
      }
      if (ctaLink) {
        const p = document.createElement("p");
        p.appendChild(ctaLink.cloneNode(true));
        contentCell.push(p);
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-daiichi", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-daiichi.js
  function parse2(element, { document }) {
    const videoSection = element.querySelector('.media-gallery_type-video, [class*="type-video"]');
    if (!videoSection) {
      return;
    }
    const cells = [];
    let videoUrl = "";
    const iframe = element.querySelector('iframe[src*="youtube"], iframe[src*="youtu.be"]');
    if (iframe) {
      const src = iframe.getAttribute("src") || "";
      const match = src.match(/youtube(?:-nocookie)?\.com\/embed\/([^?]+)/);
      if (match) {
        videoUrl = "https://www.youtube.com/watch?v=" + match[1];
      } else {
        videoUrl = src;
      }
    }
    if (!videoUrl) {
      const videoContainer = element.querySelector('.media-gallery_type-video[data-url], [data-video-url], [data-src*="youtube"]');
      if (videoContainer) {
        videoUrl = videoContainer.getAttribute("data-url") || videoContainer.getAttribute("data-video-url") || videoContainer.getAttribute("data-src") || "";
      }
    }
    if (!videoUrl) {
      const youtubeLink = element.querySelector('a[href*="youtube.com/watch"], a[href*="youtu.be"]');
      if (youtubeLink) {
        videoUrl = youtubeLink.getAttribute("href");
      }
    }
    if (!videoUrl) {
      videoUrl = "https://www.youtube.com/watch?v=btmSHxpIfXw";
    }
    const contentCell = [];
    const linkP = document.createElement("p");
    const link = document.createElement("a");
    link.href = videoUrl;
    link.textContent = videoUrl;
    linkP.appendChild(link);
    contentCell.push(linkP);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-daiichi", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-daiichi.js
  function parse3(element, { document }) {
    const cards = element.querySelectorAll(".card_article");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".ce-media img, .card_article-image-wrap img, img.media");
      const titleEl = card.querySelector(".card_article-title-wrap");
      const titleText = titleEl ? titleEl.textContent.trim() : "";
      const descEl = card.querySelector(".card_article-description-wrap p");
      const descText = descEl ? descEl.textContent.trim() : "";
      const ctaLink = card.querySelector(".wrap-buttons a");
      const imageCell = [];
      if (img) {
        imageCell.push(img);
      }
      const contentCell = [];
      if (titleText) {
        const strong = document.createElement("p");
        const boldText = document.createElement("strong");
        boldText.textContent = titleText;
        strong.appendChild(boldText);
        contentCell.push(strong);
      }
      if (descText) {
        const p = document.createElement("p");
        p.textContent = descText;
        contentCell.push(p);
      }
      if (ctaLink) {
        const p = document.createElement("p");
        p.appendChild(ctaLink.cloneNode(true));
        contentCell.push(p);
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-daiichi", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/daiichi-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      const { document } = payload;
      const mainEl = element.querySelector('main, main.main, [role="main"]');
      if (mainEl) {
        while (element.firstChild) element.removeChild(element.firstChild);
        element.appendChild(mainEl);
      }
      WebImporter.DOMUtils.remove(element, [
        // Upper footer section (inside <main> on this site)
        ".upper-footer",
        // Cookie warnings embedded in content area
        ".youtube-cookie-warning__content",
        // Any nav elements that might be inside main
        "nav",
        ".section-megamenu",
        // Non-content elements
        "noscript",
        "link"
      ]);
      const cloned = element.querySelectorAll(".slick-cloned");
      cloned.forEach((el) => el.remove());
      WebImporter.DOMUtils.remove(element, [".slick-prev", ".slick-next"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".upper-footer",
        "nav",
        ".section-megamenu"
      ]);
    }
  }

  // tools/importer/transformers/daiichi-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(sectionMetadata);
        }
        if (section.id !== sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-daiichi": parse,
    "embed-daiichi": parse2,
    "cards-daiichi": parse3
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Daiichi Sankyo Germany corporate homepage with hero, news, therapy areas, and company information",
    urls: [
      "https://www.daiichi-sankyo.de"
    ],
    blocks: [
      {
        name: "carousel-daiichi",
        instances: ["#frontSlider"]
      },
      {
        name: "embed-daiichi",
        instances: [".wrap-content-1000 > .frame-type-textmedia.frame-layout-TextmediaAsCard"]
      },
      {
        name: "cards-daiichi",
        instances: [".frame-type-columnsTwo"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Slider",
        selector: "main > .wrap-content-1280",
        style: null,
        blocks: ["carousel-daiichi"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Company Info",
        selector: "main > .page__info--section-content",
        style: null,
        blocks: ["embed-daiichi", "cards-daiichi"],
        defaultContent: [".frame-type-textmedia.frame-layout-Textmedia"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();

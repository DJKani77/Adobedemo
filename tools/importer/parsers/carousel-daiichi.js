/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-daiichi.
 * Base: carousel. Source: https://www.daiichi-sankyo.de
 * Generated: 2026-03-12
 *
 * Source DOM: #frontSlider (slick slider)
 * Each slide: .slick-slide:not(.slick-cloned) > .item > ...
 *   - Image: img.slider-section-image
 *   - Title: .slider-section .title
 *   - CTA: .wrap-buttons a
 *
 * Target (block library): 2-column table.
 *   Row per slide: Col1 = image, Col2 = heading + optional description + optional CTA link
 */
export default function parse(element, { document }) {
  // Select only real slides (not slick-cloned duplicates)
  const slides = element.querySelectorAll('.slick-slide:not(.slick-cloned)');
  const cells = [];

  slides.forEach((slide) => {
    // Extract image from slide
    const img = slide.querySelector('img.slider-section-image, img[class*="slider-section-image"]');

    // Extract title text
    const titleEl = slide.querySelector('.slider-section .title, .title');
    const titleText = titleEl ? titleEl.textContent.trim() : '';

    // Extract CTA link
    const ctaLink = slide.querySelector('.wrap-buttons a, .wrap_decoration_link a');

    // Build image cell
    const imageCell = [];
    if (img) {
      imageCell.push(img);
    }

    // Build content cell: heading + CTA link
    const contentCell = [];
    if (titleText) {
      const heading = document.createElement('h2');
      heading.textContent = titleText;
      contentCell.push(heading);
    }
    if (ctaLink) {
      const p = document.createElement('p');
      p.appendChild(ctaLink.cloneNode(true));
      contentCell.push(p);
    }

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-daiichi', cells });
  element.replaceWith(block);
}

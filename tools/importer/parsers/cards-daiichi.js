/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-daiichi.
 * Base: cards. Source: https://www.daiichi-sankyo.de
 * Generated: 2026-03-12
 *
 * Source DOM: .frame-type-columnsTwo
 * Contains .card_article items inside a 2-column TYPO3 grid.
 * Each card: image (.ce-media img), title (.card_article-title-wrap),
 *   description (.card_article-description-wrap p), CTA (.wrap-buttons a)
 *
 * Target (block library): 2-column table.
 *   Row per card: Col1 = image, Col2 = title (as heading) + description + optional CTA link
 */
export default function parse(element, { document }) {
  // Find all card articles within the two-column grid
  const cards = element.querySelectorAll('.card_article');
  const cells = [];

  cards.forEach((card) => {
    // Extract image
    const img = card.querySelector('.ce-media img, .card_article-image-wrap img, img.media');

    // Extract title
    const titleEl = card.querySelector('.card_article-title-wrap');
    const titleText = titleEl ? titleEl.textContent.trim() : '';

    // Extract description
    const descEl = card.querySelector('.card_article-description-wrap p');
    const descText = descEl ? descEl.textContent.trim() : '';

    // Extract CTA link
    const ctaLink = card.querySelector('.wrap-buttons a');

    // Build image cell
    const imageCell = [];
    if (img) {
      imageCell.push(img);
    }

    // Build content cell: heading + description + CTA
    const contentCell = [];
    if (titleText) {
      const strong = document.createElement('p');
      const boldText = document.createElement('strong');
      boldText.textContent = titleText;
      strong.appendChild(boldText);
      contentCell.push(strong);
    }
    if (descText) {
      const p = document.createElement('p');
      p.textContent = descText;
      contentCell.push(p);
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-daiichi', cells });
  element.replaceWith(block);
}

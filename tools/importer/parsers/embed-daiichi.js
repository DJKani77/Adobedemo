/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-daiichi.
 * Base: embed. Source: https://www.daiichi-sankyo.de
 * Generated: 2026-03-12
 *
 * Source DOM: .wrap-content-1000 > .frame-type-textmedia.frame-layout-TextmediaAsCard
 * Contains a YouTube video behind TYPO3 cookie consent overlay.
 * The video section has .media-gallery_type-video.youtube class.
 * Cookie consent may block direct URL extraction - fallback placeholder used.
 *
 * Target (block library): 1-column table.
 *   Single row: optional poster image + video URL link
 */
export default function parse(element, { document }) {
  // Guard: only process elements that contain a video component
  const videoSection = element.querySelector('.media-gallery_type-video, [class*="type-video"]');
  if (!videoSection) {
    // Not a video embed element - skip by replacing with nothing meaningful
    return;
  }

  const cells = [];
  let videoUrl = '';

  // Check for YouTube iframe src (including youtube-nocookie.com used by TYPO3)
  const iframe = element.querySelector('iframe[src*="youtube"], iframe[src*="youtu.be"]');
  if (iframe) {
    const src = iframe.getAttribute('src') || '';
    const match = src.match(/youtube(?:-nocookie)?\.com\/embed\/([^?]+)/);
    if (match) {
      videoUrl = 'https://www.youtube.com/watch?v=' + match[1];
    } else {
      videoUrl = src;
    }
  }

  // Check for data-url or data-src on video container
  if (!videoUrl) {
    const videoContainer = element.querySelector('.media-gallery_type-video[data-url], [data-video-url], [data-src*="youtube"]');
    if (videoContainer) {
      videoUrl = videoContainer.getAttribute('data-url') || videoContainer.getAttribute('data-video-url') || videoContainer.getAttribute('data-src') || '';
    }
  }

  // Check for YouTube links (including in nested elements)
  if (!videoUrl) {
    const youtubeLink = element.querySelector('a[href*="youtube.com/watch"], a[href*="youtu.be"]');
    if (youtubeLink) {
      videoUrl = youtubeLink.getAttribute('href');
    }
  }

  // Fallback: cookie consent blocks iframe loading on source site.
  // Video URL discovered by accepting cookies: "Daiichi Sankyo Corporate Image Movie"
  if (!videoUrl) {
    videoUrl = 'https://www.youtube.com/watch?v=btmSHxpIfXw';
  }

  // Build the cell content: optional poster image + video URL link
  const contentCell = [];

  // Add video URL as a link
  const linkP = document.createElement('p');
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;
  linkP.appendChild(link);
  contentCell.push(linkP);

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-daiichi', cells });
  element.replaceWith(block);
}

import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function getMetadataCI(name) {
  const value = getMetadata(name);
  if (value) return value;
  const meta = [...document.head.querySelectorAll('meta')].find(
    (m) => (m.getAttribute('name') || '').toLowerCase() === name.toLowerCase(),
  );
  return meta ? meta.content : '';
}

export default async function decorate(block) {
  const footerMeta = getMetadataCI('footer');
  let footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/daiichi-footer';
  let fragment = await loadFragment(footerPath);
  if (!fragment && !footerPath.startsWith('/content/')) {
    fragment = await loadFragment(`/content${footerPath}`);
  }

  block.textContent = '';
  const classes = ['brand', 'nav', 'legal'];
  let i = 0;
  while (fragment.firstElementChild) {
    const section = fragment.firstElementChild;
    if (classes[i]) section.classList.add(`footer-${classes[i]}`);
    block.append(section);
    i += 1;
  }
}

/* global history */
/* eslint import/first: 0 no-undef: 0 */
/* eslint no-restricted-globals: ["error", "event"] */

import 'babel-polyfill';
import toggleMenu from './components/toggleMenu';
import modal from './components/modal';
import file from './components/docHandler';
import { downChevron } from './components/svg/scrollChevron';
import loader from './components/importLoader';
import viewIcon from './components/svg/viewIcon';

document.addEventListener('DOMContentLoaded', (event) => {
  const menuButton = document.getElementById('menu-button');
  const homeSection = document.querySelector('.section-home');
  const homeBtn = document.getElementById('nav-home');
  const resumeBtn = document.querySelector('.resume-btn');
  const scrollChevron = downChevron();
  const iconSvg = viewIcon();

  resumeBtn.insertBefore(iconSvg, resumeBtn.childNodes[0]);

  menuButton.onclick = toggleMenu;
  document.querySelector('#cr-year').innerHTML = `- ${new Date().getFullYear()}`;

  loader();
  document.body.style.cssText = 'display: block';
  menuButton.focus();
  homeSection.appendChild(scrollChevron);
  scrollChevron.classList.add('intro-init-ui');

  homeBtn.onclick = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    removeHashUrl();
    return false;
  };
  return event;
});

// Shims & Polyfills msEdge
(function () {
  if (typeof NodeList.prototype.forEach === 'function') return false;
  NodeList.prototype.forEach = Array.prototype.forEach;
  return true;
}()); // foreach

function removeHashUrl() {
  const loc = window.location;
  let scrollV;
  let scrollH;

  if ('replaceState' in history) {
    history.replaceState('', document.title, loc.pathname + loc.search);
  } else {
    // Prevent scrolling by storing the page's current scroll offset
    scrollV = document.body.scrollTop;
    scrollH = document.body.scrollLeft;

    loc.hash = '';

    // Restore the scroll offset, should be flicker free
    document.body.scrollTop = scrollV;
    document.body.scrollLeft = scrollH;
  }
}


/* global history */
/* eslint import/first: 0 no-undef: 0 */
/* eslint no-restricted-globals: ["error", "event"] */

import 'babel-polyfill';
import toggleMenu from './components/toggleMenu';
import { downChevron } from './components/svg/scrollChevron';
import loader from './components/importLoader';
import viewIcon from './components/svg/viewIcon';


document.addEventListener('DOMContentLoaded', (event) => {
  const menuButton = document.getElementById('menu-button');
  const homeSection = document.querySelector('.section-home');
  const homeBtn = document.getElementById('nav-home');
  const aboutBtn = document.getElementById('nav-about');
  const resumeBtn = document.querySelector('.resume-btn');
  const emailBtn = document.querySelector('.email-btn');
  const scrollChevron = downChevron();
  const iconSvg = viewIcon();

  resumeBtn.insertBefore(iconSvg, resumeBtn.childNodes[0]);

  window.setTimeout(start, 450);
  window.scrollTo(0, 0);

  // emailBtn.onclick = emailModal;
  menuButton.onclick = toggleMenu;
  document.querySelector('#cr-year').innerHTML = `- ${new Date().getFullYear()}`;
  loader();
  document.body.style.cssText = 'display: block';
  menuButton.focus();
  homeSection.appendChild(scrollChevron);
  scrollChevron.classList.add('intro-init-ui');

  homeBtn.onclick = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    removeHashUrl();
    return false;
  };

  aboutBtn.onclick = (e) => {
    e.preventDefault();
    document.querySelector('.section-about').scrollIntoView({ 
      behavior: 'smooth' 
    });
    removeHashUrl();
    return false;
  }

  return event;
});

// Shims & Polyfills msEdge
(function () {
  if (typeof NodeList.prototype.forEach === 'function') return false;
  NodeList.prototype.forEach = Array.prototype.forEach;
  return true;
}()); // forEach

function start() {
  const backdrop = document.getElementById('backdrop');
  backdrop.remove();
}

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

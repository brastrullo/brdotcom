/* eslint import/first: 0 no-undef: 0 */
import 'babel-polyfill';
import toggleMenu from './components/toggleMenu';
import modal from './components/modal';
import file from './components/docHandler';
import { downChevron } from './components/svg/scrollChevron';
import loader from './components/importLoader';

document.addEventListener('DOMContentLoaded', (event) => {
  console.log('script.js');
  const menuButton = document.getElementById('menu-button');
  const resumeButton = document.querySelector('#resumeViewer');
  const homeSection = document.querySelector('.section-home');
  const scrollChevron = downChevron();

  menuButton.onclick = toggleMenu;
  resumeButton.onclick = modal;
  document.querySelector('#cr-year').innerHTML = `- ${new Date().getFullYear()}`;

  loader();
  document.body.style = 'display: block';
  menuButton.focus();
  homeSection.appendChild(scrollChevron);
  return event;
});

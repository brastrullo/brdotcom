/* global Velocity */

const Velocity = require('../../node_modules/velocity-animate/velocity.min.js');
require('../../node_modules/velocity-animate/velocity.ui.min.js');

export default function toggleMenu() {
  const button = document.getElementById('menu-button');
  const homeLink = document.getElementById('nav-home');
  const text = button.querySelector('text');

  button.classList.contains('off') ? showMenu() : closeMenu(); // eslint-disable-line

  function showMenu() {
    button.classList.remove('off');
    button.classList.add('on');
    stagger.show();
    text.innerHTML = 'close';
    homeLink.focus();
    animateMenu.open();
  }

  function closeMenu() {
    button.classList.remove('on');
    button.classList.add('off');
    stagger.hide();
    text.innerHTML = 'menu';
    animateMenu.close();
  }
}

const stagger = (function stagger() {
  const mainNav = document.querySelector('.main-nav');
  const menuItems = mainNav.querySelectorAll('li');
  const delay = 80;

  function staggerShow() {
    let i = 0;
    mainNav.style.cssText = 'display: block';
    window.setTimeout(function run() {
      if (i < menuItems.length) {
        menuItems[i].classList.add('show-menu-item');
        setTimeout(run, delay);
      }
      i += 1;
    }, delay);
    clearTimeout();
  }

  function staggerHide() {
    let i = 0;
    window.setTimeout(function run() {
      if (i < menuItems.length) {
        menuItems[i].classList.remove('show-menu-item');
        setTimeout(run, delay);
      }
      i += 1;
    }, delay);
    window.setTimeout(() => { mainNav.style.cssText = 'display: none'; }, delay * menuItems.length);
    clearTimeout();
  }

  return {
    show: staggerShow,
    hide: staggerHide,
  };
}());

const animateMenu = (function animateMenu() {
  const svg = document.getElementsByClassName('menu-line');
  const b1 = svg[0];
  const b2 = svg[1];
  const b3 = svg[2];

  function animateOpenBtn() {
    const topSeq = [
      { e: b1, p: { translateY: 6 }, o: { duration: '100ms' } },
      { e: b1, p: { rotateZ: 45 }, o: { duration: '100ms' } },
    ];
    const bottomSeq = [
      { e: b3, p: { translateY: -6 }, o: { duration: '100ms' } },
      { e: b3, p: { rotateZ: -45 }, o: { duration: '100ms' } },
    ];

    b1.setAttribute('transform-origin', 'center center 0');
    b3.setAttribute('transform-origin', 'center center 0');
    Velocity.RunSequence(topSeq);
    Velocity(b2, { opacity: 0 }, 100);
    Velocity.RunSequence(bottomSeq);
  }

  function animateCloseBtn() {
    const topLine = [
      { e: b1, p: { rotateZ: 0 }, o: { duration: '100ms' } },
      { e: b1, p: { translateY: 0 }, o: { duration: '100ms' } },
    ];
    const bottomLine = [
      { e: b3, p: { rotateZ: 0 }, o: { duration: '100ms' } },
      { e: b3, p: { translateY: 0 }, o: { duration: '100ms' } },
    ];

    Velocity.RunSequence(topLine);
    Velocity(b2, 'reverse', 100);
    Velocity.RunSequence(bottomLine);
  }

  return {
    open: animateOpenBtn,
    close: animateCloseBtn,
  };
}());

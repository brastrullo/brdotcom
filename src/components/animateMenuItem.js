import { elClass } from '../utils';

export default function animateMenuItem() {
  const menuItems = document.querySelectorAll('.menu-item');
  const listItems = document.querySelectorAll('#main-nav li');

  menuItems.forEach(el => addPipes(el));
  menuItems.forEach(el => el.addEventListener('mouseover', animatePipe));
  menuItems.forEach(el => el.addEventListener('mouseout', unAnimatePipe));

  function addPipes(el) {
    const pipe1 = elClass('div', 'end-pipe');
    const str = el;

    pipe1.innerHTML = '||';
    str.innerHTML = `${str.innerHTML.toUpperCase()}`;
    str.appendChild(pipe1);
  }

  function animatePipe(e) {
    const spaceWidth = 5;
    const w = e.target.offsetWidth;
    const pipe = this.querySelector('div');
    pipe.style.cssText = `
      opacity: 1;
      transform: translate(${-w - spaceWidth}px);
    `;
  }

  function unAnimatePipe(e) {
    const w = e.target.offsetWidth;
    const pipe = this.querySelector('div');
    pipe.style.cssText = `
      opacity: 0;
      transform: translate(0px);
    `;
  }
}

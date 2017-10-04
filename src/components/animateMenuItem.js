import { elClass } from '../utils';

export default function animateMenuItem() {
  const menuItems = document.querySelectorAll('.menu-item');
  const listItems = document.querySelectorAll('#main-nav li');

  menuItems.forEach(el => addPipes(el));
  menuItems.forEach(el => el.addEventListener('mouseover', animatePipe));
  menuItems.forEach(el => el.addEventListener('mouseout', unAnimatePipe));

  function addPipes(el) {
    const endPipe = elClass('div', 'end-pipe');
    endPipe.innerHTML = '|';
    const str = el;
    str.innerHTML = `${str.innerHTML.toUpperCase()} |`;
    str.appendChild(endPipe);
  }

  function animatePipe(e) {
    const spaceWidth = 5;
    const w = e.target.offsetWidth;
    const pipe = this.querySelector('div');
    pipe.style = `
      opacity: 1;
      transform: translate(${-w - spaceWidth}px);
    `;
  }
  function unAnimatePipe(e) {
    const w = e.target.offsetWidth;
    const pipe = this.querySelector('div');
    pipe.style = `
      opacity: 0;
      transform: translate(0px);
    `;
  }
}

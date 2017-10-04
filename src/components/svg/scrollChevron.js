// css class="svg-'x'chevron"
import { elClass, makeBtn } from '../../utils';

function upChevron() {
  const frag = document.createDocumentFragment();
  frag.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="svg-upchevron" width="80" viewbox="0 0 30 12">
      <path stroke-width="1" fill="none" d="M2 10 L 15 2 L 28 10"/>
    </svg>
  `;
  return frag;
}

function downChevron() {
  const button = makeBtn('scrolldown', 'scrolldown');
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="svg-downchevron" width="80" viewbox="0 0 30 18">
      <text x="5" y="4" font-size="4" font-family="sans-serif">scroll down</text>
      <path class="animate-downchevron" stroke-width="1" fill="none" d="M2 7 L 15 15 L 28 7"/>
    </svg>
  `;
  return button;
}

function leftChevron() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" class="svg-leftchevron" height="80" viewbox="0 0 12 30">
    <path stroke-width="1" fill="none" d="M10 2 L 2 15 L 10 28"/>
  </svg>
 `;
}

function rightChevron() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" class="svg-rightchevron" height="80" viewbox="0 0 12 30">
      <path stroke-width="1" fill="none" d="M2 2 L 10 15 L 2 28"/>
    </svg>
  `;
}

export { upChevron, downChevron, leftChevron, rightChevron };

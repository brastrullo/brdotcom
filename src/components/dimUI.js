export default function dimUI() {
  let sPosition = 0;
  let ticking = false;

  window.addEventListener('scroll', (e) => {
    sPosition = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const ui = document.querySelector('.social-media-nav');
        (function dimmer() { ui.classList.add('dim-ui'); }());
        window.setTimeout(() => ui.classList.remove('dim-ui'), 1000);
        ticking = false;
      });
    }
    ticking = true;
  });
}

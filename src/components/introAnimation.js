export default function introAnimation() {
  window.setTimeout(startIntro, 400);
  window.setTimeout(clearIntroAnim, 4000);

  function startIntro() {
    moveText();
    showUi();
  }

  function moveText() {
    const introName = document.querySelector('.intro-name');
    const introBlock = document.querySelector('.intro-block');
    introName.classList.add('intro-anim-move-name');
    introBlock.classList.add('intro-anim-move-block');
  }

  function showUi() {
    const headerLogo = document.querySelector('.logo');
    const ui = document.querySelectorAll('.intro-init-ui');
    headerLogo.removeAttribute('style');
    headerLogo.classList.add('header-logo');
    ui.forEach(el => el.classList.add('intro-anim-show-ui'));
  }

  function clearIntroAnim() {
    const initUI = document.querySelectorAll('.intro-init-ui');
    const animUI = document.querySelectorAll('.intro-anim-show-ui');

    initUI.forEach(el => el.classList.remove('intro-init-ui'));
    initUI.forEach(el => el.classList.remove('intro-anim-show-ui'));
  }
}

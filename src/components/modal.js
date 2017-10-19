import file from './docHandler';
import viewHandler from './viewHandler';
import { elClass, makeBtn } from '../utils';


const modal = (function modal() {
  let contentInput;
  const options = {};
  options.header = '';
  options.size = 'medium';// xsmall,small,medium,large
  options.primaryBtn = undefined;
  options.primaryFn = undefined;
  options.secondaryBtn = undefined;
  options.secondaryFn = undefined;
  options.tertiaryBtn = undefined;
  options.tertiaryFn = undefined;

  function addModal() {
    const bg = elClass('div', 'modal-background');
    const wrapper = elClass('div', `modal-${options.size} modal-wrapper`);
    const menu = modalMenu();
    const content = modalContent();
    const actions = modalActions();
    document.body.appendChild(bg);
    bg.appendChild(wrapper);
    wrapper.appendChild(menu);
    wrapper.appendChild(content);
    wrapper.appendChild(actions);
  }

  function modalMenu() {
    const menu = elClass('div', 'modal-menu');
    const header = elClass('h1', 'modal-h1');
    const closeBtn = makeBtn('close', 'close-btn btn');

    closeBtn.onclick = closeModal;

    header.innerHTML = options.header;
    menu.appendChild(header);
    menu.appendChild(closeBtn);

    return menu;
  }

  function setOptions(obj) {
    options.header = obj.header;
    options.size = obj.size;
    options.primaryBtn = obj.primaryBtn;
    options.primaryFn = obj.primaryFn;
    options.secondaryBtn = obj.secondaryBtn;
    options.secondaryFn = obj.secondaryFn;
    options.tertiaryBtn = obj.tertiaryBtn;
    options.tertiaryFn = obj.tertiaryFn;
  }

  function setContent(input) {
    contentInput = input;
  }

  function modalContent() {
    const div = elClass('div', 'modal-content');
    div.appendChild(contentInput);
    return div;
  }

  function clickPrimary() {
    document.querySelector('#primaryBtn').click();
  }

  function clickSecondary() {
    document.querySelector('#secondaryBtn').click();
  }

  function clickTertiary() {
    document.querySelector('#tertiaryBtn').click();
  }

  function closeModal() {
    document.body.querySelector('.modal-background').remove();
  }

  function modalActions() {
    const actions = elClass('div', 'modal-actions');

    if (options.primaryBtn) {
      const primaryBtn = makeBtn(options.primaryBtn, 'modal-actions-primary btn-active');
      primaryBtn.onclick = options.primaryFn;
      actions.appendChild(primaryBtn);
    }

    if (options.secondaryBtn) {
      const secondaryBtn = makeBtn(options.secondaryBtn, 'modal-actions-secondary btn-active');
      secondaryBtn.onclick = options.secondaryFn;
      actions.appendChild(secondaryBtn);
    }

    if (options.tertiaryBtn) {
      const tertiaryBtn = makeBtn(options.tertiaryBtn, 'modal-actions-tertiary btn-active');
      tertiaryBtn.onclick = options.tertiaryBtn;
      actions.appendChild(tertiaryBtn);
    }
    return actions;
  }

  return {
    open: addModal,
    close: closeModal,
    set: setContent,
    options: setOptions,
    primary: clickPrimary,
    secondary: clickSecondary,
    tertiary: clickTertiary,
  };
}());

export default modal; 
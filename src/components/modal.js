import file from './docHandler';
import viewHandler from './viewHandler';
import { elClass, makeBtn } from '../utils';

export default function modal() {
  (function addModal() {
    const bg = elClass('div', 'modal-background');
    const wrapper = elClass('div', 'modal-wrapper');
    const menu = modalMenu();
    const content = modalContent();
    document.body.appendChild(bg);
    bg.appendChild(wrapper);
    wrapper.appendChild(menu);
    wrapper.appendChild(content);
  }());

  function modalMenu() {
    const menu = elClass('div', 'modal-menu');
    const dropdown = docViewDropdown();
    const switchBtn = fileTypeSwitch();
    const downloadBtn = downloadButtton();
    const printBtn = makeBtn('print', 'print-btn btn');
    const shareBtn = makeBtn('share', 'share-btn btn');
    const closeBtn = makeBtn('close', 'close-btn btn');
    const column1 = elClass('div', 'options-view');
    const column2 = elClass('div', 'options-actions');


    closeBtn.onclick = closeModal;

    menu.appendChild(column1);
    menu.appendChild(column2);


    column1.appendChild(dropdown);
    column1.appendChild(switchBtn);

    column2.appendChild(downloadBtn);
    column2.appendChild(printBtn);
    column2.appendChild(shareBtn);
    column2.appendChild(closeBtn);

    printBtn.innerHTML = 'print';

    return menu;

    function closeModal() {
      document.body.querySelector('.modal-background').remove();
    }
  }

  function modalContent() {
    const iframe = elClass('iframe', 'resume-viewer');
    iframe.setAttribute('src', 'https://brastrullo.github.io/resume/');
    iframe.setAttribute('title', 'resume');
    iframe.innerHTML = '<p>Your browser does not support iframes.</p>';
    return iframe;
  }

  function docViewDropdown() {
    const dropdown = elClass('select', 'doc-view');
    dropdown.innerHTML = `
      <option value='html' selected>HTML</option>
      <option value='pdf'>PDF/DOC</option>
    `;

    dropdown.addEventListener('change', updateView);

    function updateView() {
      file.setVal(this.value);
      viewHandler();
    }
    return dropdown;
  }

  function fileTypeSwitch() {
    const switchBtn = elClass('label', 'file-type switch hidden');
    const checkbox = elClass('input', 'file-type checkbox');
    const slider = elClass('span', 'file-type slider round');

    checkbox.setAttribute('type', 'checkbox');
    switchBtn.appendChild(checkbox);
    switchBtn.appendChild(slider);

    switchBtn.addEventListener('click', toggleFileType);
    return switchBtn;

    function toggleFileType() {
      const downloadBtn = document.querySelector('.download-btn.btn');
      const printBtn = document.querySelector('.print-btn.btn');

      const val = checkbox.checked ? 'doc' : 'pdf';
      file.setVal(val);
      downloadBtn.setAttribute('href', file.getSrc());
      downloadBtn.setAttribute('download', `brastrullo-jsdev-resume.${val}`);
      downloadBtn.innerHTML = 'download ';

      printBtn.setAttribute('print', file.getSrc());
      printBtn.innerHTML = 'print';
    }
  }

  function downloadButtton() {
    const button = elClass('a', 'download-btn btn hidden');
    button.setAttribute('href', 'https://brastrullo.github.io/resume/BradR-JSDev.pdf');
    button.setAttribute('download', 'brastrullo-jsdev-resume.pdf');
    button.innerHTML = 'download';
    return button;
  }
}

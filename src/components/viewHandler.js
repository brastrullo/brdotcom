import file from './docHandler';

export default function viewHandler() {
  const downloadBtn = document.querySelector('.download-btn.btn');
  const iframe = document.querySelector('.resume-viewer');
  const switchBtn = document.querySelector('.file-type.switch');

  iframe.setAttribute('src', file.getSrc());

  switch (file.getVal()) {
    case 'html':
      switchBtn.classList.add('hidden');
      switchBtn.setAttribute('disabled', '');
      downloadBtn.classList.add('hidden');
      downloadBtn.setAttribute('disabled', '');
      downloadBtn.removeAttribute('src');
      break;
    case 'pdf':
    case 'doc':
      switchBtn.classList.remove('hidden');
      switchBtn.removeAttribute('disabled');
      downloadBtn.classList.remove('hidden');
      downloadBtn.removeAttribute('disabled');
      break;
    default:
      break;
  }
}

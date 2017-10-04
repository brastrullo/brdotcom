import logo from './svg/logo';

function loadingScreen() {
  const backdrop = document.getElementById('backdrop');
  backdrop.classList.add('loading-screen-backdrop');
  backdrop.style.background = pastelColors();
  document.body.style = 'overflow: hidden';
  backdrop.insertBefore(logo(), backdrop.childNodes[0]);

  window.setTimeout(showLoading, 200);
}

function showLoading() {
  const path = document.getElementById('loadingBar');
  const length = path.getTotalLength();

  path.style.transition = 'none';
  path.style.WebkitTransition = 'none';
  path.style = 'opacity: 1';
  path.style.strokeDasharray = `${length} ${length}`;
  path.style.strokeDashoffset = length;
  path.getBoundingClientRect();
  path.style.transition = 'stroke-dashoffset 150ms ease-in';
  path.style.WebkitTransition = 'stroke-dashoffset 150ms ease-in';
  path.style.strokeDashoffset = '0';

  function start() {
    const backdrop = document.getElementById('backdrop');
    backdrop.remove();
    document.body.style = 'overflow: unset';
  }

  window.setTimeout(start, 350);
  window.scrollTo(0, 0);
  return true;
}

function pastelColors() {
  const r = (Math.round(Math.random() * 127) + 127).toString(16);
  const g = (Math.round(Math.random() * 127) + 127).toString(16);
  const b = (Math.round(Math.random() * 127) + 127).toString(16);
  return `#${r}${g}${b}`;
}

export default loadingScreen;

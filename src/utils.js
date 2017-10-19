function elClass(element = 'div', classes = 0) {
  const el = document.createElement(element);
  if (classes !== 0) {
    if (/\s/.test(classes)) {
      const arr = classes.split(' ');
      el.classList.add(...arr);
    } else {
      el.classList.add(classes);
    }
  }
  return el;
}

function makeBtn(name, classes = 0) {
  const arr = classes.split(' ');
  const button = elClass('button', classes);
  button.setAttribute('name', name);
  button.setAttribute('type', 'button');
  button.innerHTML = name;
  return button;
}

export { elClass, makeBtn };

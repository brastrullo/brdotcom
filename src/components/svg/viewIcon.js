export default function viewIcon() {
  const eye = document.createElement('span');// eslint-disable-line no-shadow
  eye.innerHTML = `
    <svg xmlns='http://www.w3.org/2000/svg' class='svg-view-icon' width='20' viewbox='0 0 210 140'>
       <path d="M5 70 A 110 100 0 0 1 200 70 A 110 100 0 0 1 5 70" stroke="none" fill="lightgrey" stroke-width="1"/>
      <circle cx="105" cy="70" r="35" stroke="white" fill="lightgrey" stroke-width="5">
    </svg>
  `;
  eye.style.cssText = `
    display: inline-block;
    vertical-align: middle;
    margin-top: .25em;
    margin-right: .25em;
  `;
  return eye;
}

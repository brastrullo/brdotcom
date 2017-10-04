export default function logo() {
  const mainLogo = document.createElement('div');// eslint-disable-line no-shadow
  mainLogo.innerHTML = `
    <svg xmlns='http://www.w3.org/2000/svg' class='svg-logo' width='200' height='200' viewbox='0 0 500 500'>
      <g>
        <text x='110' y='250' font-family='Helvetica' font-size='180' fill='rgba(30, 30, 30, .8)'>
          b||r
        </text>
        <path id='loadingBar' d='M90 330 h 320' style='opacity: 0;' stroke-width=20 stroke='rgba(230, 230, 230, .8)' />
      </g>
    </svg>
  `;
  return mainLogo;
}

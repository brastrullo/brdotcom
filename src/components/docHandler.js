const file = (function file() {
  let src;
  let val;
  const base = 'https://brastrullo.github.io/resume/';
  const pdf = `${base}BradR-JSDev.pdf`;
  const doc = ['BradR-JSDev.pdf', 'BradR-JSDev.doc'];

  function setSrc() {
    switch (val) {
      case 'html':
        src = base;
        break;
      case 'pdf':
        src = base + doc[0];
        break;
      case 'doc':
        src = base + doc[1];
        break;
      default:
        src = base;
    }
  }

  function setVal(filetype) { val = filetype; setSrc(); }
  function getVal() { return val; }
  function getSrc() { return src; }
  function getPdf() { return pdf; }

  return {
    setVal,
    getVal,
    getSrc,
    getPdf,
  };
}());

export default file;

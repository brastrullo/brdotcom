const emailHandler = (function emailHandler() {
  const s = {};

  function setForm() {
    const form = document.getElementById('emailForm');
    if (s.name !== '') { s.name = form.querySelector('#senderName').value; }
    if (s.subject !== '') { s.subject = form.querySelector('#emailSubject').value; }
    s.email = form.querySelector('#senderEmail').value;
    s.body = form.querySelector('#emailBody').value;
  }

  function getForm() {
    return s;
  }

  return {
    set: setForm,
    get: getForm,
  };
}());

export default emailHandler;

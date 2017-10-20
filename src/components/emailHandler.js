const emailHandler = (function emailHandler() {
  const s = {};

  function setForm() {
    const form = document.getElementById('emailForm');
    s.name = form.querySelector('#senderName').value;
    s.email = form.querySelector('#senderEmail').value;
    s.subject = form.querySelector('#emailSubject').value;
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
import modal from './modal';
import mailer from './emailHandler';
import { elClass, makeBtn } from '../utils';
import confirm from './emailPostModal';

export default function emailModal() {
  const options = {
    header: 'Email',
    size: 'medium',
    primaryBtn: 'Send Email',
    primaryFn: modal.primary,
    secondaryBtn: 'Cancel',
    secondaryFn: modal.close,
  };

  (function buildForm() {
    const form = elClass('form', 'html-form email-form');
    const p = elClass('p', 'email-form-instructions');
    const checkmark = elClass('span', 'validation-checkmark');
    const senderWrapper = elClass('div', 'email-form-sender-wrapper');
    const nameLabel = elClass('label', 'html-label name-label');
    const name = elClass('input', 'html-input email-form-name');
    const emailLabel = elClass('label', 'html-label address-label');
    const email = elClass('input', 'html-input email-form-address');
    const subjectLabel = elClass('label', 'html-label email-form-subject-label');
    const subject = elClass('input', 'html-input email-form-subject-label');
    const contentLabel = elClass('label', 'html-label email-form-conten-label');
    const content = elClass('textarea', 'html-textarea email-form-content');
    const submitBtn = makeBtn('Submit', 'hidden');
    const checkForm = () => {
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let errorMsg = '';
      let requiredValid = 0;
      if (!regex.test(email.value)) {errorMsg += '- Please enter valid email. \n'}
      if (content.value.length === 0) {errorMsg += '- Please add message. \n'}
      if (email.value.length > 0 && content.value.length > 0) {requiredValid = 1;}

      errorMsg ? logMsg() : valid();

      function logMsg() {
        alert(errorMsg);
        return;
      }

      function valid() {
        console.log('No errors');
        sendEmail();
        return;
      }
    };

    form.setAttribute('id', 'emailForm');
    form.action = '#';
    form.setAttribute('method', 'POST');
    p.innerHTML = 'Please enter valid email address and message.';
    checkmark.innerHTML = '&#10003';
    p.appendChild(checkmark);
    form.appendChild(p);
    nameLabel.innerHTML = 'Name: ';
    emailLabel.innerHTML = 'Email: ';
    nameLabel.setAttribute('for', 'senderName');
    emailLabel.setAttribute('for', 'senderEmail');
    name.setAttribute('id', 'senderName');
    name.setAttribute('placeholder', 'Name (optional)');
    email.setAttribute('id', 'senderEmail');
    email.setAttribute('placeholder', 'Email (required)');
    email.required = true;
    senderWrapper.appendChild(nameLabel);
    senderWrapper.appendChild(name);
    senderWrapper.appendChild(emailLabel);
    senderWrapper.appendChild(email);
    form.appendChild(senderWrapper);
    subjectLabel.innerHTML = 'Subject: ';
    subject.setAttribute('id', 'emailSubject');
    subject.setAttribute('placeholder', 'Subject (optional)');
    form.appendChild(subjectLabel);
    form.appendChild(subject);
    contentLabel.innerHTML = 'Body: ';
    content.setAttribute('id', 'emailBody');
    content.setAttribute('placeholder', 'Message');
    content.required = true;
    submitBtn.setAttribute('id', 'primaryBtn');
    submitBtn.onclick = checkForm;
    submitBtn.setAttribute('form', 'emailForm');
    form.appendChild(contentLabel);
    form.appendChild(content);
    form.appendChild(submitBtn);

    email.addEventListener('keyup', validateInput);
    content.addEventListener('keyup', validateInput);
    modal.set(form);
    modal.options(options);
    modal.open();

    function validateInput() {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regex.test(email.value) && content.value.length > 0) {
          checkmark.style.opacity = 1;
        } else {
          checkmark.style.opacity = 0;
          console.log(regex.test(email.value), (content.value.length > 0));
      }
    }
  }());

  function sendEmail() {
    console.log('*Email Sent');
    mailer.set();
    modal.close();
    modal.set(confirm());
    modal.open();
  }
}


import nodemailer from '../../node_modules/nodemailer/';
  let emailHandler;

  nodemailer.createTestAccount((err, account) => {
    const m = emailHandler.get();
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: 'brastrullo.dev@gmail.com',
        pass: 'CARDINALS2017',
      },
    });

    const mailOptions = {
      from: `"${m.name}" <${m.email}>`,
      to: `brastrullo@gmail.com`,
      subject: `${m.subject}`,
      text: `${m.body}`,
      html: `<p>${m.body}</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return true;
    });
  });

emailHandler = (function emailHandler() {
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

// function ajax() {
//   let httpRequest;
//   function makeRequest() {
//     httpRequest = new XMLHttpRequest();

//     if (!httpRequest) {
//       alert('Giving up :( Cannot create an XMLHTTP instance');
//       return false;
//     }
//     httpRequest.onreadystatechange = alertContents;
//     httpRequest.open('GET', '');
//     httpRequest.send();
//   }

//   function alertContents() {
//     try {
//       if (httpRequest.readyState === XMLHttpRequest.DONE) {
//         if (httpRequest.status === 200) {
//           alert('Key up');
//         } else {
//           alert('There was a problem with the request.');
//         }
//       }
//     }
//     catch( e ) {
//       alert('Caught Exception: ' + e.description);
//     }
//   }

//   function validate() {
//     const emailWrapper = document.querySelector('.email-form-sender-wrapper');
//     const msg = elClass('span', 'error-email');

//     emailWrapper.appendChild(msg);

//   }
// }
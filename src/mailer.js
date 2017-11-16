import nodemailer from '../node_modules/nodemailer/';
import SMTPConnection from '../node_modules/nodemailer/lib/smtp-connection';
import emailHandler from './components/emailHandler';
    
const mailer = function mailer() {
  const options = {};
  const m = emailHandler.get();
  let connection = new SMTPConnection(options);

  sendData(m);

  nodemailer.createTestAccount((err, account) => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: 'brastrullo.dev@gmail.com',
        pass: 'purxnyvfenvvgadf',
      },
    });

    const mailOptions = {
      from: `"${m.name}" <${m.email}>`,
      to: `"bradleyrastrullo@gmail.com, ${m.email}"`,
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
};

export default mailer;

function sendData(data) {
  var XHR = new XMLHttpRequest();
  var urlEncodedData = "";
  var urlEncodedDataPairs = [];
  var name;

  // Turn the data object into an array of URL-encoded key/value pairs.
  for(name in data) {
    urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
  }

  // Combine the pairs into a single string and replace all %-encoded spaces to 
  // the '+' character; matches the behaviour of browser form submissions.
  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

  console.log(urlEncodedData);

  // Define what happens on successful data submission
  XHR.addEventListener('load', function(event) {
    alert('Yeah! Data sent and response loaded.');
  });

  // Define what happens in case of error
  XHR.addEventListener('error', function(event) {
    alert('Oups! Something goes wrong.');
  });

  // Set up our request
  XHR.open('POST', 'https://api.nodemailer.com/user');

  // Add the required HTTP header for form data POST requests
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  console.log(XHR.getAllResponseHeaders());
  // Finally, send our data.
  XHR.send(urlEncodedData);
}

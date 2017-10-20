import nodemailer from '../node_modules/nodemailer/';
import SMTPConnection from '../node_modules/nodemailer/lib/smtp-connection';
import emailHandler from './components/emailHandler';
    
const mailer = function mailer() {
  const options = {};
  let connection = new SMTPConnection(options);

  nodemailer.createTestAccount((err, account) => {
    const m = emailHandler.get();
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
      // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return true;
    });
  });
};

export default mailer;

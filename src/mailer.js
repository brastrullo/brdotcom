import nodemailer from '../node_modules/nodemailer/lib/nodemailer';
import emailHandler from './components/emailHandler';

// const SMTPConnection = require('nodemailer/lib/smtp-connection');

// import addCors from './addCors1';

// const mailer = function mailer() {
//   const options = {};
//   const m = emailHandler.get();
//   const connection = new SMTPConnection(options);

//   let transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: 'brastrullo.dev@gmail.com',
//       pass: 'ewmlqvepxpchagrs',
//     },
//     debug: {
//       logger: true,
//       debug: true
//     }
//   });

//   const mailOptions = {
//     from: `"${m.name}" <${m.email}>`,
//     to: `"bradleyrastrullo@gmail.com, ${m.email}"`,
//     subject: `${m.subject}`,
//     text: `${m.body}`,
//     html: `<p>${m.body}</p>`,
//   };

//   nodemailer.createTestAccount((err, account) => {
//     console.log(`account: ${account}`);
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.ethereal.email',
//       port: 587,
//       secure: false,
//       auth: {
//         user: 'account.user',
//         pass: 'account.pass',
//       },
//     });

//     const mailOptions = {
//       from: 'Brad',
//       to: 'bradleyrastrullo@gmail.com, brastrullo.dev@gmail.com',
//       subject: 'No Subject',
//       text: 'Body text: asdfasdfasdf',
//       html: '<p>Body text: asdfasdfasdf</p>',
//     };


//     transporter.verify((error, success) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log('Server is ready to take our messages');
//       }
//     });

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log('Error occurred');
//         console.log(error.message);
//         return process.exit(1);
//       }

//       console.log('Message sent successfully!');
//       console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
//       return;
//     });
//   });
// };

// export default mailer;

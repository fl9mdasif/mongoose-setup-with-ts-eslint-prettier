import nodemailer from 'nodemailer';
import config from '../config';
export const sendMail = async (to: string, html: string) => {
  //
  // SMTP -> Send mail transfer protocol
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'asifalazadami2016@gmail.com',
      pass: 'gxnw tmlg decd jckf',
    },
  });

  //
  await transporter.sendMail({
    from: 'asifalazadami2016@gmail.com', // sender address
    to, // list of receivers
    subject: 'reset your password within 10min', // Subject line
    text: '', // plain text body
    html, // html body
  });
  // console.log('Message sent: %s', info.messageId);
};

const nodemailer = require('nodemailer')

const sendEmail = async ( emailData, email, subject, message) => {
        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com', // enter your host name
            port: 465,
            secure: true,
            auth: {
                user: 'admin@prashil.semantica.co.in',
                pass: 'codePass123',
            }
        });
        await transporter.sendMail({
            from: 'admin@prashil.semantica.co.in',
            to: email,
            subject: 'New Lead',
            html: `<div><h1>${emailData.message}<h1><br/>${emailData.name}<br/>${emailData.email}<br/>${emailData.subject}</div>` ,
        });
}

module.exports = sendEmail;
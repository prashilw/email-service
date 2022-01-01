const nodemailer = require('nodemailer')

const sendEmail = async (url, email) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.in', // enter your host name
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
            subject: 'Confirm your email',
            html: `<h1>Hello world</h1>`,
        });
    }
    catch(e){
        console.log(e);
    }
}

module.exports = sendEmail;
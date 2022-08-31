import nodemailer from 'nodemailer';

export async function sendLoginEmail({ email, url, token }:
    { email: string, url: string, token: string }) {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        }
    })

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <fred.foo@example.com>', // sender address
        to: email,
        subject: 'Login to your account', // Subject line
        html: `Login by clicking here <a href="${url}/login#token=${token}">HERE</a>`, // html body
    })

    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}
import nodemailer from 'nodemailer'; 
import 'dotenv/config'; 

export const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST, 
    port: Number(process.env.BREVO_SMTP_PORT), 
    secure: false, 
    auth : {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
   },
}); 

export const sendVerificationByEmail = async (email, token) => {
    await transporter.sendMail({
        from: "Authentification API <maxime.darrigade@orange.fr", 
        to: email,z,
        subject: "Confirmez votre email", 
        html: `<h2> Bienvenue ${email} !</h2>
        <p>Merci de faire partis des membres de Luxury Watch. Cliquez sur le lien ci-dessous pour vérifier votre compte :</p>
        <a href="http://localhost:3000/api/auth/verify?token=${token}">Vérifier mon email</a>`, 
    }); 
};

export const sendResetPassword = async (email,token) => {
    await transporter.sendMail({
        from: '"Auth API" <no-reply@monapi.com>', 
        to: email, 
        subject: "Réinitialisation du mot de passe", 
        html: `<p>Cliquez sur le lien pour réinitialiser votre mot de passe :</p>
        <a href="http://localhost:3000/api/auth/rest-password?token=${token}">Réinitialiser ici</a>`
    });
};
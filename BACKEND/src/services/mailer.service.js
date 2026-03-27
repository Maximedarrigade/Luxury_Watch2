import nodemailer from "nodemailer"; 
import "dotenv/config"; 

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST, 
    port: Number(process.env.BREVO_SMTP_PORT), 
    secure: false, 
    auth: {
        user: process.env.BREVO_SMTP_USER, 
        pass: process.env.BREVO_SMTP_PASS
    }

}); 

transporter.verify((err) => {
    if(err) console.error(' SMTP erreur :', err.message);
    
    else console.log(' SMTP connecté !');

}); 

export const sendVerificationEmail = async (email, token) => {

    await transporter.sendMail({
        from: 'Authentification API <maxime.darrigade@orange.fr>', 
        to: email, 
        subject: 'Confirmez votre email', 
        html: `<h2>Bienvenue ${email} !</h2>
        <p>Merci de vous être inscrit, Cliquez sur le lien ci-dessous pour vérifier ton compte :</p>
        <a href="http://localhost:3000/api/auth/verify?token${token}">Vérifier mon email</a>`, 

    }); 

}; 

export const SendResetPasswordEmail = async(email, token) => {

    await transporter.sendMail({
        from: '"Auth API" <maxime.darrigade@orange.fr>', 
        to: email, 
        subject: 'Réinitialisation du mot de passe', 
        html: `<p>Cliquez sur le lien pour réinitialiser votre mot de passe :</p>
        <a href="http://localhost:3000/api/auth/reset-password?token=${token}">Réinitialiser</a>`

    });

};
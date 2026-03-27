import { createUser , findUserByEmail, findUserByResetToken, findUserByVerifyToken, verifyUser, updatePassword,saveResetToken } from "../models/user.models.js";
import argon2 from "argon2"; // argon 2 permet le hash du mot de passe 
import jwt from 'jsonwebtoken'; 
import { v4 as uuidv4 } from "uuid";
import 'dotenv/config';  
import {sendVerificationEmail, SendResetPasswordEmail} from '../services/mailer.service.js'; 
import { db } from "../config/db.js";

export const register = async (req, res) => {
    try {
        
        const {email, password} = req.body; 
        const existing = await findUserByEmail(email); 
        
        if(existing) return res.status(400).json({message: "Email déjà utilisé"}); 

        const passwordHash = await argon2.hash(password); 
        const verifyToken= uuidv4(); 

        await createUser(email, passwordHash, verifyToken); 
        await sendVerificationEmail(email, verifyToken); 

        res.status(201).json({message: "Compte créé, vérifiez votre email"}); 

    } catch (error) {
        
        res.status(500).json({message: "Erreur serveur", error:error.message}); 

    }
}; 

export const verifyEmail = async (req, res) => {
    try {
        
        const {token} = req.body; 
        const user = await findUserByVerifyToken(token); 

        if(!user) return res.status(400).json({message: "Token invalide"}); 
        
        await verifyUser(user.id); 

        res.status(200).json({message: "compte vérifié, vous pouvez vous connecter"}); 

    } catch (error) {
        
        res.status(500).json({message: "Erreur serveur", error:error.message}); 

    }
    
}; 

export const login = async (req, res) => {
    try {
        
        const {email, password} = req.body; 
        const user = await findUserByEmail(email); 

        if(!user) return res.status(400).json({message: "Email ou mot de passe incorrect"}); // message d'erreur envoyé au client sans lui indiquer ou le problème pour une question de sécurité 
        if(!user.is_verified) return res.status(403).json({message: "Compte non vérifié"}); 

        const valid = await argon2.verify(user.password_hash, password); 

        if(!valid) return res.status(400).json({message: "Email ou mot de passe incorrect"}); // message d'erreur envoyé au client sans lui indiquer ou le problème pour une question de sécurité 

        const token = jwt.sign({id:user.id,email:user.email,role:user.role}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRES_IN}); 

        res.status(200).json({token}); 

    } catch (error) {
     
        res.status(500).json({message: "Erreur serveur", error:error.message})
    }
}; 

export const resetPasswordRequest = async (req, res) => {
    try {
        
        const {email} =req.body; 
        const user = await findUserByEmail(email); 

        if(!user) return res.status(400).json({message: "Email non trouvé"}); 

        const resetToken = uuidv4(); 

        await saveResetToken(user.id, resetToken); 
        await SendResetPasswordEmail(email, resetToken); 

        res.status(200).json({message: "Email de réinitialisation envoyé"}); 

    } catch (error) {
        
        res.status(500).json({message: "Erreur serveur", error:error.message}); 

    }
}; 

export const resetPassword = async (req, res) => {
    try {
        
        const {token, password} = req.body; 
        const user = findUserByResetToken(token); 

        if(!user) return res.status(400).json({message: "Token invalide"}); 

        const passwordHash = await argon2.hash(password); 

        await updatePassword(user.id, passwordHash); 
        await db.query('UPDATE users SET rest_token=NULL WHERE id=?', [user.id]); 

        res.status(200).json({message: "Mot de passe réinitialisé"}); 

    } catch (error) {
     
        res.status(500).json({message: "Erreur serveur", error:error.message}); 

    }
}; 


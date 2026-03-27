import express from "express"; 
import { register, verifyEmail, login, resetPasswordRequest, resetPassword } from "../controllers/auth.controller.js";
import { validateRegister, validateLogin } from "../middleware/validation.middleware.js";

const router = express.Router(); 

router.post('/register', validateRegister, register); 
router.post('/login', validateLogin, login); 
router.post('/forgot-password', resetPasswordRequest); 
router.post('/reset-password', resetPassword); 

router.get('/verify', verifyEmail); 

export default router; 



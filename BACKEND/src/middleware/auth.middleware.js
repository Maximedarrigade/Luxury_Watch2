import jwt from 'jsonwebtoken'; // permet de transmettre des données de manière sécurisée sous la forme d'un objet JSON, qui est lui même vérifié par une signature numérique 
import 'dotenv/config'; // offre une solution efficace pour gérer la configuration des applications, aide le développeur à protéger les données sensibles et à maintenir un code plus propre 

export const authenticate = (req, res, next) => {
    
    const authHeader  = req.headers.authorization; 
    if(!authHeader) return res.status(401).json({message: "Token manquant"}); 

    const token = authHeader.split(' ')[1]; 

    try {
        
        req.user = jwt.verify(token, process.env.JWT_SECRET); 

        next(); 

    } catch (error) {
        
        return res.status(403).json({message: "Token invalide"}); 

    }
}; 

export const authorize = (roles=[]) => (req, res, next) => {
    
    if(!roles.includes(req.user.role)) return res.status(403).json({message: "Accès interdit"}); 

    next(); 
    
}; 


import z from 'zod'; // Importation de la librairie "zod" pour la validation des schémas de données coté serveur 

export const validateRegister = (req, res, next) => {
    // Middleware qui permet de valider les données lors de l'inscription d'un utilisateur 
    // Reçoit l'objet request, response et la fonction next pour passer au middleware suivant 

    const schema = z.object({
        email: z.email(), // Vérifie que le champ 'email' est un email valide 
        password: z.string().min(6), // Vérifie que 'password' est une chaîne d'au moins 6 caractères
        confirmPassword: z.string().min(6) // Vérifie que 'confirmPassword' est une chaîne d'au moins 6 caractères
    });

    try {
        
        schema.parse(req.body); 
        // Exécute la validation du corps de la requête selon le schéma défini
        // 'parse' lance une exeption si la validation échoue 

        if(req.body.password !== req.body.confirmPassword)
        
            return res.status(400).json({message: "Les mots de passe ne correspondent pas"}); 
            // Vérifie la correspondance entre 'password' et 'confirmPassword' 
            // Si non identiques, renvoie une réponse 400 avec un message d'erreur 

            next(); 
            // si toutes les validations sont correctes, passe au middleware suivant 

    } catch (e) {
        
        return res.status(400).json({message: e.errors.map(err=>err.message).join(", ")});
        // Capture les erreurs de validation Zod et retourne un statut 400 avec les messages concaténés 
    }

}; 

export const validateLogin = (req, res, next) => {
    //Middleware pour valider les données de connexion 

    const schema = z.object({
        email:z.email(), // Vérifie que l'email est valide 
        password: z.string().min(6) // Vérifie que le mot de passe contient au moins 6 caractères 
    }); 

    try {
        
        schema.parse(req.body); 
        // Valide le corps de la requête selon le schéma défini

        next();
        // Passe au middleware suivant si la validation réussit

    } catch (e) {
        
        return res.status(400).json({message: e.errors.map(err=>err.message).join(", ")}); 
        // Retourne les erreurs de validation Zod avec statut 400 si échec 

    }
}; 
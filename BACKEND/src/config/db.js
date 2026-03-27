import mysql from 'mysql2/promise'
import 'dotenv/config'

let db; 

try {
// Création d'une pool de connexions MySQL
// Permet de réutiliser les connexions et gérer plusieurs requêtes simultanées

    db = await mysql.createPool(({ 
        
        host: process.env.DB_HOST,     // Adresse du serveur MySQL
        user: process.env.DB_USER,     // Utilisateur MySQL
        password: process.env.DB_PASSWORD, // Mot de passe MySQL
        database: process.env.DB_NAME  // Nom de la base de données

    })); 
        
    // Test pour savoir si on est connecté à la base de données
    
    console.log(' Connexion à la base de données réussie');
    
    await db.getConnection();

    
} catch (error) {
    // Gestion des erreurs de connexion
    
    console.error(' Erreur de connexion à la base de données :', error.message);
    process.exit(1); // Arrêt du serveur si la DB n’est pas accessible
    
}

// Export de la pool pour l’utiliser dans les models

export { db };
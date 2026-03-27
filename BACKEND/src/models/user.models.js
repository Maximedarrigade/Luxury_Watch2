import {db} from "../config/db.js"; // Importation du module de configuration de la base de données pour permettre l'exécution de requêtes SQL.


export const createUser = async (email, passwordHash, verifyToken, role='USER') => {
    // Fonction asynchrone pour créer un nouvel utilisateur dans la base de données.
    // Paramètres : email, mot de passe hashé (avec argon2 pour la sécurité), token de vérification et le role par défault qui est 'USER'

    const [result] = await db.query(
        'INSERT INTO users (email, password_hash, verify_token, role) VALUES (?,?,?,?)', 
        [email, passwordHash, verifyToken, role]
    );
        // Execution d'une requête 'INSERT' pour insérer un nouvel enregistrement dans ma table 'users' 
        // Utilisation de placeholders (?) pour éviter les injections SQL
    

    return result.insertId;
    // Retourne l'identifiant unique généré pour le nouvel utilisateur 

};

export const findUserByEmail = async (email) => {
    // Fonction asynchrone pour récuperer un utilisateur par son email 

    const [rows] = await db.query('SELECT * FROM users WHERE email=?', [email]);
    // Requête 'SELECT' pour aller chercher l'utilisateur correspondant a l'email fourni 

    return rows[0]; 
    // Nous retourne le premier utlisateur trouvé (ou undefined si aucun utilisateur trouvé)

}; 

export const findUserByVerifyToken = async (token) => {
    // Fonction asynchrone pour retrouver un utilisateur à partir de son token de vérification 

    const [rows] = await db.query('SELECT * FROM users WHERE verify_token=?', [token]);
    // Requête 'SELECT' filtrant sur le champ 'verify_token'

    return rows[0]; 
    // Retourne le premier utilisateur trouvé ou undefined si aucun utilisateur trouvé 

};

export const findUserByResetToken = async (token) => {
    // Fonction asynchrone pour récupérer un utilisateur via son token de réinitialisation de mot de passe 

    const [rows] = await db.query('SELECT * FROM users WHERE reset_token=?', [token]); 
    // Requête 'SELECT' filtrant sur le champ 'reset_token'

    return rows[0]; 
    // Retourne le premier utilisateur trouvé ou undefined si aucun utilisateur trouvé 

};

export const verifyUser = async (userId) => {
    // Fonction asynchrone pour valider un utilisateur en mettant à jour son statut de vérification 

    await db.query('UPDATE users SET is_verified=1, verify_token=NULL WHERE id=?', [userId]); 
    // Requête 'UPDATE' qui active le champ 'is_verified' et supprime le 'verify_token' pour sécuriser l'accès

}; 

export const updatePassword = async (userId, passwordHash) => {
    // Fonction asynchrone pour modifier le mot de passe d'un utilisateur existant 

    await db.query('UPDATE users SET password_hash=? WHERE id=?', [passwordHash, userId]); 
    // Requête 'UPDATE' pour remplacer le hash du mot de passe de l'utilisateur par son ID

}; 

export const saveResetToken = async (userId, token) => {
    // Fontion asynchrone pour stocker un token de réinitialisation de mot de passe pour un utilisateur 

    await db.query('UPDATE users SET reset_token=? WHERE id=?', [token, userId  ]); 
    // Requête 'UPDATE' qui assigne le token fourni à l'utilisateur correspondant a l'ID

}; 
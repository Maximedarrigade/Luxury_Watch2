-- Création de la base de données

CREATE DATABASE IF NOT EXISTS Luxury_Watch
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE Luxury_Watch;

-- Table des users

CREATE TABLE users (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    email             VARCHAR(100) UNIQUE NOT NULL,
    password_hash     VARCHAR(255) NOT NULL,
    nom               VARCHAR(50),
    prenom            VARCHAR(50),
    telephone         VARCHAR(20),
    date_inscription  DATETIME DEFAULT CURRENT_TIMESTAMP,
    role              ENUM('client', 'admin') DEFAULT 'client',
    INDEX idx_email   (email)
);

-- Table des produits 

CREATE TABLE produits (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    nom               VARCHAR(150) NOT NULL,
    reference         VARCHAR(100) UNIQUE,
    marque            VARCHAR(100),
    description       TEXT,
    prix              DECIMAL(10,2) NOT NULL,          -- prix TTC
    stock             INT UNSIGNED DEFAULT 0,
    image_principale  VARCHAR(255) NOT NULL,           -- chemin ex: /montres/001-main.jpg
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_url    (url),
    INDEX idx_marque  (marque)
);

-- Table des images pour les montres 

CREATE TABLE images_produits (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    produit_id    INT NOT NULL,
    chemin        VARCHAR(255) NOT NULL,          -- ex: /montres/001.jpg
    position      INT DEFAULT 1,                 -- 1 = image principale vue de face 
    legende       VARCHAR(150) DEFAULT NULL,      -- Vue de profil, Détail du cadran
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
    INDEX idx_produit_position (produit_id, position)
);

-- Table du panier (support visiteurs + utilisateurs connectés)

CREATE TABLE panier_items (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NULL,     -- NULL pour les visiteurs non connectés
    session_id    VARCHAR(64) NULL,     -- UUID ou random pour les visiteurs anonymes
    produit_id    INT NOT NULL,
    quantite      INT UNSIGNED NOT NULL DEFAULT 1,
    date_ajout    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)    REFERENCES users(id)   ON DELETE SET NULL,
    INDEX idx_session         (session_id),
    INDEX idx_user            (user_id),
    INDEX idx_produit         (produit_id),
    UNIQUE KEY unique_item    (user_id, session_id, produit_id)         -- évite les doublons
);

-- Table des adresses (livraison & facturation)

CREATE TABLE adresses (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL,
    type          ENUM('livraison', 'facturation') DEFAULT 'livraison',
    nom           VARCHAR(50),
    prenom        VARCHAR(50),
    ligne1        VARCHAR(100) NOT NULL,            
    ligne2        VARCHAR(100),         -- pour les complements d'adresse 
    code_postal   VARCHAR(10),
    ville         VARCHAR(50),
    pays          VARCHAR(50) DEFAULT 'France',
    telephone     VARCHAR(20),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_type (user_id, type)
);

-- Table des commandes

CREATE TABLE commandes (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    numero_commande         VARCHAR(20) UNIQUE NOT NULL,      
    user_id                 INT NOT NULL,
    adresse_livraison_id    INT NOT NULL,
    adresse_facturation_id  INT NULL,     -- peut être la même que l'adresse de livraison 
    prix_total              DECIMAL(10,2) NOT NULL,
    mode_paiement           ENUM('carte', 'paypal', 'applePay', 'autre') DEFAULT 'carte',
    reference_paiement      VARCHAR(100) NULL,      -- Stripe intent ID, PayPal order ID...
    statut                  ENUM('en_attente', 'payee', 'en_preparation', 'expediee', 'livree', 'annulee') DEFAULT 'en_attente',
    date_commande           DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_mise_a_jour        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)               REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (adresse_livraison_id)  REFERENCES adresses(id),
    FOREIGN KEY (adresse_facturation_id) REFERENCES adresses(id),
    INDEX idx_numero            (numero_commande),
    INDEX idx_user_statut       (user_id, statut),
    INDEX idx_date_commande     (date_commande)
);

-- Détails des lignes de commandes

CREATE TABLE commande_lignes (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    commande_id     INT NOT NULL,
    produit_id      INT NOT NULL,
    quantite        INT UNSIGNED NOT NULL,
    FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id)  REFERENCES produits(id)  ON DELETE RESTRICT,      -- garde une trace même si produit supprimé
    INDEX idx_commande (commande_id)
);
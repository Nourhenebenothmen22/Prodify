// --------------------
// IMPORTATIONS
// --------------------
import express, { Request, Response, NextFunction } from "express"; // Framework Express + types TypeScript
import morgan from "morgan"; // Logger HTTP pour suivre les requêtes
import dotenv from "dotenv"; // Charger les variables d'environnement depuis un fichier .env
import cors from "cors"; // Pour autoriser les requêtes cross-origin (CORS)
import helmet from "helmet"; // Sécuriser les headers HTTP
import rateLimit from "express-rate-limit"; // Limiter le nombre de requêtes par IP
import { clerkMiddleware } from '@clerk/express'; // Middleware d'authentification Clerk
import userRoutes from "./routes/UserRoutes"; // Routes pour les utilisateurs
import productRoutes from "./routes/ProductRoutes"; // Routes pour les produits
import commentRoutes from "./routes/CommentRoutes"; // Routes pour les commentaires

// --------------------
// VARIABLES D'ENVIRONNEMENT
// --------------------
// Charger automatiquement les variables définies dans le fichier .env
// {quiet:true} supprime les warnings si le fichier .env est absent
dotenv.config({ quiet: true });

// --------------------
// INITIALISATION DE L'APPLICATION EXPRESS
// --------------------
const app = express();

// --------------------
// MIDDLEWARES
// --------------------

// Logger toutes les requêtes HTTP (GET, POST, etc.) dans la console
app.use(morgan("dev"));

// Sécuriser l'application en ajoutant des headers HTTP sécurisés
app.use(helmet());

// Autoriser les requêtes venant d'autres domaines (CORS)
app.use(cors({ origin: process.env.FRONTEND_URL}));

// Parser automatiquement le corps des requêtes au format JSON
// Cela permet de récupérer req.body directement en JSON
app.use(express.json());

// Middleware Clerk pour gérer l'authentification
app.use(clerkMiddleware());

// Limiter le nombre de requêtes par IP pour prévenir les abus ou attaques DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: 100, // Maximum 100 requêtes par IP dans cette fenêtre
  standardHeaders: true, // Retourne les informations de rate limit dans les headers standard
  legacyHeaders: false, // Désactive les headers X-RateLimit
});
app.use(limiter);

// Configurer Express pour renvoyer du JSON joliment formaté (2 espaces)
app.set("json spaces", 2);

// Mounting Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

// --------------------
// ROUTES
// --------------------

// Route de test à la racine pour vérifier que le serveur fonctionne
app.get("/", (req: Request, res: Response) => {
  res.json({
    message:
      "Welcome to Productify API – Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

// Route pour vérifier l'état du serveur
app.get("/api/status", (req: Request, res: Response) => {
  res.json({
    message: "Server is running",
    timestamp: new Date(), // Date et heure du serveur
    version: "1.0.0", // Version de l'API
  });
});

// --------------------
// GESTION DES ERREURS
// --------------------
// Middleware global de gestion des erreurs
// Si une erreur se produit dans une route, elle sera capturée ici
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Afficher l'erreur dans la console pour debug
  res.status(500).json({ error: "Internal Server Error" }); // Message générique côté client
});

// --------------------
// DEMARRAGE DU SERVEUR
// --------------------
const PORT = process.env.PORT || 3000; // Prend le port défini dans .env sinon 3000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

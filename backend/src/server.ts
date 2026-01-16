import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

const app = express();

// --------------------
// MIDDLEWARES
// --------------------

// Logger HTTP
app.use(morgan("dev"));

// Sécurité HTTP headers
app.use(helmet());

// Autoriser les requêtes cross-origin
app.use(cors());

// Parser le JSON automatiquement
app.use(express.json());

// Limiter le nombre de requêtes pour chaque IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// --------------------
// ROUTES
// --------------------

// Route de test
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});


// --------------------
// PORT
// --------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

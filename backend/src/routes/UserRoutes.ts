import { Router } from "express"; // Import Express Router to create modular routes
import { syncUser } from "../controllers/userController"; // Import the controller that handles user sync
import { requireAuth } from "@clerk/express"; // Import Clerk middleware to require authentication

const router = Router(); // Create a new router instance

// Define a POST route at /sync
// This route is protected by requireAuth, so only logged-in users can access it
// If authenticated, the syncUser controller runs to sync the user with the database
router.post("/sync", requireAuth, syncUser);


export default router; // Export the router to use it in the main server file

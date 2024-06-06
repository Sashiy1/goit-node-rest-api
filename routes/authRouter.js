import express from "express";
import { registerUser, loginUser, logoutUser, checkCurrentUser } from "../controllers/authControllers.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", auth, logoutUser)
router.get("/current", auth, checkCurrentUser)

export default router;

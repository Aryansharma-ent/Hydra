import express from "express";
import { registerUser, loginUser, googleLogin, getMe } from "../Controllers/AuthController";
import { protect } from "../Middlewares/AuthMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/me", protect, getMe);

export default router;
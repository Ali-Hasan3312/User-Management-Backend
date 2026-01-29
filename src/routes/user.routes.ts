import { Router } from "express";
import { getUser, loginUser, registerUser, updateUser } from "../controllers/user.controller";
import { protectedRoute } from "../middlewares/auth";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protectedRoute, getUser)
router.put("/me", protectedRoute, updateUser)


export default router;
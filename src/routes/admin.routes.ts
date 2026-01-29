import { Router } from "express";
import { blockUser, getAllUsers, updateAdmin } from "../controllers/admin.controller";
import { protectedRoute } from "../middlewares/auth";
import { isAdmin } from "../middlewares/role";

const router = Router();

router.get("/allUsers", protectedRoute,isAdmin, getAllUsers)
router.put("/me", protectedRoute, isAdmin, updateAdmin)
router.put("/block/:id", protectedRoute, isAdmin, blockUser)

export default router;
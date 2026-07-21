import { Router } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { addDishToStopController, addRemainderController, getStopListController, removeFromStopController } from "./stop-list.controllers";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";


const router = Router();


router.get('/get-stop-list', authMiddleware, requireRole(["MANAGER", "DIRECTOR"]), asyncHandler(getStopListController));
router.post('/add-dish', authMiddleware, requireRole(["MANAGER", "DIRECTOR"]), asyncHandler(addDishToStopController));
router.post('/add-rem', authMiddleware, requireRole(["MANAGER", "DIRECTOR"]), asyncHandler(addRemainderController));
router.post('/remove-stop', authMiddleware, requireRole(["MANAGER", "DIRECTOR"]),asyncHandler(removeFromStopController));



export default router;
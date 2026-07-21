import { Router } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { changeStatusFilterController, getStatusFilterController, getTicketsController, updateDishStatusController } from "./station.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();


router.post('/', authMiddleware, asyncHandler(getTicketsController));
router.post('/update-dish-status', asyncHandler(updateDishStatusController));

router.post('/change-status-filter', authMiddleware, asyncHandler(changeStatusFilterController));

router.get('/get-status-filter', authMiddleware, asyncHandler(getStatusFilterController));

export default router;
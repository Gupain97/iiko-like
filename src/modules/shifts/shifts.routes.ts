import express from "express";
import { closeShiftUserController , getActiveUsersController} from "./shifts.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../middlewares/asyncHandler";


const router = express.Router();

router.get('/', getActiveUsersController);
router.post('/closeShiftUser', authMiddleware,  asyncHandler (closeShiftUserController));


export default router;
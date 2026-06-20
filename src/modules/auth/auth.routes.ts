import { Router } from "express";
import { deleteSessionController, login } from './auth.controller';
import { authMiddleware } from "./../../middlewares/auth.middleware";
import { asyncHandler } from "./../../middlewares/asyncHandler";

const router = Router();

router.post('/login', asyncHandler(login));
router.delete('/delete', asyncHandler(deleteSessionController));

export default router;
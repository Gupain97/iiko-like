import { Router } from "express";
import { login } from '../controllers/auth.controller';
import { authMiddleware } from "../middlewares/auth.middleware";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

router.post('/login', asyncHandler(login)); 

export default router;
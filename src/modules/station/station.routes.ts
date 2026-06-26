import { Router } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { getTicketsController } from "./station.controller";

const router = Router();


router.post('/', asyncHandler(getTicketsController));

export default router;
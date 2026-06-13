import { Router } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { getItemsController } from "./station.controller";

const router = Router();


router.post('/', asyncHandler(getItemsController));

export default router;
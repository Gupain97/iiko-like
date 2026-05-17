import express from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { getAllMenuController, getCurrentStopListController } from "./menu.controller";


const router = express.Router();


router.get('/', asyncHandler(getAllMenuController));
router.get('/get-stop-list', asyncHandler(getCurrentStopListController));


export default router;
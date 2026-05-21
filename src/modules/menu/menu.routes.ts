import express from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { addItemToStopController, getAllMenuController, getCurrentStopListController } from "./menu.controller";


const router = express.Router();


router.get('/', asyncHandler(getAllMenuController));
router.get('/get-stop-list', asyncHandler(getCurrentStopListController));

router.post('/add-to-stop', asyncHandler(addItemToStopController));


export default router;
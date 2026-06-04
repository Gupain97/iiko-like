import express from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import  { getAllMenuController } from "./menu.controller";


const router = express.Router();


router.get('/', asyncHandler(getAllMenuController));
// router.get('/get-stop-list', asyncHandler(getCurrentStopListController));

// router.post('/add-to-stop', asyncHandler(addItemToStopController));
// router.post('/delete-from-stop', asyncHandler(deleteItemFromStopController));


export default router;
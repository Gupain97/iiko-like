import express from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import  { getAllMenuController, getDishBySearchController } from "./menu.controller";


const router = express.Router();


router.get('/', asyncHandler(getAllMenuController));

router.post('/search-dish', asyncHandler(getDishBySearchController));
// router.get('/get-stop-list', asyncHandler(getCurrentStopListController));

// router.post('/add-to-stop', asyncHandler(addItemToStopController));
// router.post('/delete-from-stop', asyncHandler(deleteItemFromStopController));


export default router;
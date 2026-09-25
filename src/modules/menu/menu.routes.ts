import express from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import  { getAllMenuController, getDishBySearchController } from "./menu.controller";


const router = express.Router();


router.get('/', asyncHandler(getAllMenuController));

router.post('/search-dish', asyncHandler(getDishBySearchController));


export default router;
import express from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { getAllMenuController } from "./menu.controller";


const router = express.Router();


router.get('/', asyncHandler(getAllMenuController));


export default router;
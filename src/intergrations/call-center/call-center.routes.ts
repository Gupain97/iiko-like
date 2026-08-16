import express from "express"
import { asyncHandler } from "../../middlewares/asyncHandler";
import { createDeliveryController, getDishCCController } from "./call-center.controller";


const router = express.Router();


router.post('/create-delivery', createDeliveryController);
router.post('/get-dish', getDishCCController);


export default router
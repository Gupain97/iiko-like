import express from "express";
import { getDeliveryOrdersController, getWeatherController, updateStatusDeliveryController } from "./delivery.controllers";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../middlewares/asyncHandler";


const router = express.Router();


router.get('/', getWeatherController);
router.get('/get-orders', getDeliveryOrdersController)

router.post('/send', authMiddleware, asyncHandler(updateStatusDeliveryController));

export default router;
import express from "express";
import { getWeatherController } from "./delivery.controllers";


const router = express.Router();


router.get('/', getWeatherController);

export default router;
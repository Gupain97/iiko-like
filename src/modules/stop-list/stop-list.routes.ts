import { Router } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { addDishToStopController, addRemainderController, getStopListController, removeFromStopController } from "./stop-list.controllers";


const router = Router();


router.get('/get-stop-list', asyncHandler(getStopListController));
router.post('/add-dish', asyncHandler(addDishToStopController));
router.post('/add-rem', asyncHandler(addRemainderController));
router.post('/remove-stop', asyncHandler(removeFromStopController));



export default router;
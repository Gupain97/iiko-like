import express from 'express'
import { asyncHandler } from '../../middlewares/asyncHandler';
import { addItemToOrderControllerNew, addItemQuantityController } from './orderItems.controllers';

const router = express.Router();


router.post('/:id/items',  asyncHandler(addItemToOrderControllerNew));

router.post('/:itemId/increment', asyncHandler(addItemQuantityController));


export default router;
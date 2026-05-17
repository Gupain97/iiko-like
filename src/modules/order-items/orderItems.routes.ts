import express from 'express'
import { asyncHandler } from '../../middlewares/asyncHandler';
import { addItemToOrderControllerNew, addItemQuantityController, decrementItemQantityController, deleteItemController } from './orderItems.controllers';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = express.Router();


router.post('/:id/items',  asyncHandler(addItemToOrderControllerNew));

router.post('/:itemId/increment', asyncHandler(addItemQuantityController));

router.post('/:itemId/decrement', asyncHandler(decrementItemQantityController));
router.delete('/:itemId/delete', asyncHandler(deleteItemController));


export default router;
import express from 'express';
import { validateOrderItem } from '../../middlewares/validateOrderItems';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { 
     getOrders,
     createOrGetOrderController,
  //   getOrderByTableController,
  //   addItemToOrderController,
     closeOrderByOrderIdController,
 //    getOrderByIdController,
     prechekOrderController,
     printOrderController,
     addItemToOrderControllerNew,
     addItemQuantityController,

      } from './order.controller'; 
 

const router = express.Router();

router.get('/:id', getOrders);

router.post('/', asyncHandler(createOrGetOrderController));
 

 
router.post('/:id/items',  asyncHandler(addItemToOrderControllerNew));

router.post('/:itemId/increment', asyncHandler(addItemQuantityController));

 

router.post('/print', asyncHandler(printOrderController));

router.post('/precheck', asyncHandler(prechekOrderController));

router.post('/close', closeOrderByOrderIdController);

export default router;
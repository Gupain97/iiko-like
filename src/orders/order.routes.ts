import express from 'express';
import { validateOrderItem } from '../middlewares/validateOrderItems';
import { asyncHandler } from '../middlewares/asyncHandler';
import { 
     getOrders,
     createOrGetOrderController,
  //   getOrderByTableController,
  //   addItemToOrderController,
 //    closeOrderController,
 //    getOrderByIdController,
     prechekOrderController,
     printOrderController,
     addItemToOrderControllerNew,

      } from './order.controller'; 
 

const router = express.Router();

router.get('/', getOrders);

router.post('/orders', asyncHandler(createOrGetOrderController));
//router.get('/orders', getOrderByTableController );

//router.post('/orders/add-item', validateOrderItem, asyncHandler(addItemToOrderController));
router.post('/orders/:id/items',  asyncHandler(addItemToOrderControllerNew));

//router.get('/orders/:tableId', getOrderByIdController);

router.post('/orders/print', asyncHandler(printOrderController));

router.post('/orders/precheck', asyncHandler(prechekOrderController));

// router.post('/orders/close', closeOrderController);

export default router;
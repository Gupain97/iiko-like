import express from 'express';
import { validateOrderItem } from '../../middlewares/validateOrderItems';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { 
     getOrdersController,
     createOrGetOrderController,
     closeOrderByOrderIdController,
     prechekOrderController,
     printOrderController,
     cancelPrecheckOrderController

      } from './order.controller'; 
import { requireRole } from '../../middlewares/role.middleware';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { checkWaiter } from '../../middlewares/waiter.middleware';
 

const router = express.Router();

router.get('/:id', getOrdersController);

router.post('/', authMiddleware, checkWaiter, asyncHandler(createOrGetOrderController));
 

 

 

router.post('/print', asyncHandler(printOrderController));

router.post('/precheck', asyncHandler(prechekOrderController));

router.post('/cancel-precheck', authMiddleware,  requireRole(["MANAGER", "DIRECTOR"]),  asyncHandler(cancelPrecheckOrderController));

router.post('/close', closeOrderByOrderIdController);

export default router;
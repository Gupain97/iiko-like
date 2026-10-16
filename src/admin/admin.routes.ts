import express from 'express';
import { getAllCategoriesController,
     getPossiblyfunctionsController, 
     addCategoryController,
     getAllItemsController,
     addMenuItemController,
     getAllUsersController,
     addUserController,
     getAdminUserController,
     getDishForAdminController,
     loginAdminController,
     getIngredientsController,
     addIngredientController,
     updateRecipeController
    } from './admin.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { adminAuthMiddleware } from '../middlewares/adminAuth';
import { addIngredient } from './admin.services';

const router = express.Router();

router.get('/main', getPossiblyfunctionsController);

router.post('/login', asyncHandler(loginAdminController));

router.get('/categories',  getAllCategoriesController);
router.post('/categories', addCategoryController); 


router.get('/menu-items', getAllItemsController);
router.post('/menu-items', addMenuItemController);

router.get('/get-item/:id', adminAuthMiddleware, getDishForAdminController);

router.get('/ingredients', adminAuthMiddleware, asyncHandler(getIngredientsController));
router.post('/ingredients', adminAuthMiddleware, asyncHandler(addIngredientController));


router.post('/get-item/:itemId/recipe', adminAuthMiddleware, asyncHandler(updateRecipeController));
router.get('/users', getAllUsersController);
router.post('/users', addUserController);



export default router;
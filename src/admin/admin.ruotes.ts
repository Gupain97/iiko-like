import express from 'express';
import { getAllCategoriesController,
     getPossiblyfunctionsController, 
     addCategoryController,
     getAllItemsController,
     addMenuItemController,
     getAllUsersController,
     addUserController
    } from './admin.controller';
import { addUser } from './admin.services';
 


const router = express.Router();

router.get('/', getPossiblyfunctionsController);

router.get('/categories', getAllCategoriesController);
router.post('/categories', addCategoryController); 


router.get('/menu-items', getAllItemsController);
router.post('/menu-items', addMenuItemController)

router.get('/users', getAllUsersController);
router.post('/users', addUserController)



export default router;
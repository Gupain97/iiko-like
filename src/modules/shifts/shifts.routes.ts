import express from "express";
import { closeShiftUserController , getActiveUsersController} from "./shifts.controller";


const router = express.Router();

router.get('/', getActiveUsersController);
router.post('/closeShiftUser', closeShiftUserController);


export default router;
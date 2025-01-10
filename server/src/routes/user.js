import express from "express";
import verifyToken from "../middlewares/verifyToken";
import { upload } from "../middlewares/upload";

import * as userController from "../controller/user.controller"

const router = express.Router()

router.use(verifyToken)
router.get('/get-current', userController.getCurrent)
router.patch('/update-profile', upload.single("anh"), userController.updateProfile)
router.patch('/update-host-profile', upload.single("anh"), upload.fields([
    { name: 'anhCCCDMatTruoc', maxCount: 1 },
    { name: 'anhCCCDMatSau', maxCount: 1 },
]), userController.updateHostProfile)
router.patch('/change-password', userController.changePassword)
router.get('/get-all', userController.getAll)
router.get('/get-all-locked', userController.getAllLocked)
router.patch('/lock-user/:id', userController.lockUser)
router.patch('/unlock-user/:id', userController.unLockUser)
router.get('/user-detail/:id', userController.getUserDetail)

export default router
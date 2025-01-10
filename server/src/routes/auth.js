import express from "express";

import * as authController from "../controller/auth.controller"
import { verifyEmail } from "../controller/verifyEmail.controller";

const router = express.Router()

router.post('/register', authController.register)
router.get('/verifyEmail', verifyEmail)
router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:token', authController.resetPassword)
router.get('/reset-password/:token', authController.verifyResetPasswordToken)

export default router
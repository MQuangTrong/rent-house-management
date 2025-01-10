import express from "express";
import verifyToken from "../middlewares/verifyToken";
import { upload } from "../middlewares/upload";

import * as hostController from "../controller/host.controller"

const router = express.Router()

router.use(verifyToken)
router.post('/register-host', upload.fields([
    { name: 'anhCCCDMatTruoc', maxCount: 1 },
    { name: 'anhCCCDMatSau', maxCount: 1 },
]), hostController.registerHost);
router.get('/host-pending-approve', hostController.getHostsPendingApproval);
router.get('/host-pending-approve-detail/:id', hostController.getHostsPendingApprovalDetail);
router.patch('/approve-host/:id', hostController.approveHost);
router.patch('/reject-host/:id', hostController.rejectHost);

export default router
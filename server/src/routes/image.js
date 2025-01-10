import express from "express";
import { upload } from "../middlewares/upload";

import * as imageController from "../controller/image.controller"

const router = express.Router()

router.post('/upload-image-profile', upload.single('anh'), imageController.uploadImage)
router.post('/upload-image-cccd', upload.single('anhCCCDMatTruoc'), imageController.uploadImage)
router.post('/upload-image-cccd-back', upload.single('anhCCCDMatSau'), imageController.uploadImage)

// Route để upload nhiều ảnh
router.post('/upload-images', upload.array('anh', 10), imageController.uploadImages);

export default router
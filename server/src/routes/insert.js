import express from "express";

import * as insertController from "../controller/insert.controller"

const router = express.Router()

router.post('/quan', insertController.insertQuan)
router.post('/phuong/:districtId', insertController.insertPhuong)


export default router
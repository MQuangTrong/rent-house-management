import express from "express";

import * as controller from "../controller/district_ward.controller"

const router = express.Router()

router.get('/district', controller.getDistrict)
router.get('/ward/:districtId', controller.getWard)


export default router
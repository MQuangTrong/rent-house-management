import express from "express";

import * as statisticsController from "../controller/statistics.controller"
import verifyToken from "../middlewares/verifyToken";

const router = express.Router()

router.get('/general-statistic', statisticsController.getGeneralStatistics)
router.get('/revenue-statistic',verifyToken, statisticsController.getRevenueByMonthAndYear);



export default router
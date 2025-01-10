import express from "express";

import * as roomController from "../controller/room.controller"
import verifyToken from "../middlewares/verifyToken";

const router = express.Router()

router.get('/rooms-lasted', roomController.getRoomLasted)
router.get('/rooms-filter-sorted', roomController.getRoomFilterSorted)
router.get('/room-detail/:id', roomController.getRoomDetail)
router.get('/room-detail/:id', roomController.getRoomDetail)
router.get('/pendding-approve-post', roomController.getPenddingApprovePost)
router.patch('/approve-post/:id', roomController.approvePost)
router.patch('/reject-post/:id', roomController.rejectPost)
router.get('/all-post-filter', roomController.getAllPostFilter)
router.get('/post-detail/:id', roomController.getPostDetail)

router.get('/room-list-filter', verifyToken, roomController.getRoomListFilter)
router.get('/room-list-deleted-filter', verifyToken, roomController.getRoomListDeleteFilter)
router.post('/add-room', verifyToken, roomController.addRoom)
router.patch('/delete-room/:id', verifyToken, roomController.deleteRoom)
router.patch('/recover-room/:id', verifyToken, roomController.recoverRoom)
router.get('/get-room-edit/:id', verifyToken, roomController.getRoomEdit)
router.patch('/edit-room/:id', verifyToken, roomController.EditRoom)


export default router
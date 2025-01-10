import express from "express";
import verifyToken from "../middlewares/verifyToken";


import * as bookingController from "../controller/booking.controller"
const router = express.Router()

router.post('/add-room-to-cart', verifyToken, bookingController.addRoomToCart)
router.get('/get-cart-detail', verifyToken, bookingController.getCartDetails)
router.delete('/delete-cart-detail/:id', verifyToken, bookingController.deleteCartDetail)
router.post('/create-booking', verifyToken, bookingController.createBooking)
router.get('/get-booking-pending-approval', verifyToken, bookingController.getBookingPendingApproval)
router.get('/get-booked-room', verifyToken, bookingController.getBookedRoom)
router.patch('/approval-booking/:id', verifyToken, bookingController.approvalBooking)
router.get('/history', verifyToken, bookingController.getHistory)
router.patch('/finish-booking/:id', verifyToken, bookingController.finishBooking)
router.get('/get-booking-detail/:id', verifyToken, bookingController.getBookingDetail)
router.get('/get-booked-user-detail/:id', verifyToken, bookingController.getBookedUserDetail)

export default router

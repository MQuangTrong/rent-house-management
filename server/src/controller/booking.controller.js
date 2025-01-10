import * as services from '../services/booking.service'

export const addRoomToCart = async (req, res) => {
  const id = req.user.id
  try {
    const response = await services.addRoomToCardService(req.body, id);
    res.status(200).json(response); // Trả về kết quả
  } catch (error) {
    res.status(500).json(error); // Xử lý lỗi nếu có
  }
};

export const getCartDetails = async (req, res) => {
  const id = req.user.id
  try {
    const response = await services.getCartDetailsService(id);
    res.status(200).json(response); // Trả về kết quả
  } catch (error) {
    return res.status(500).json({
      err: 1,
      msg: 'fail at booking controller: ' + error
  }); // Xử lý lỗi nếu có
  }
};

export const deleteCartDetail = async (req, res) => {
  const {id} = req.params
  try {
    const response = await services.deleteCartDetailService(id);
    res.status(200).json(response); // Trả về kết quả
  } catch (error) {
    res.status(500).json(error); // Xử lý lỗi nếu có
  }
};

export const createBooking = async (req, res) => {
  try {
    const response = await services.createBookingService(req.body);
    res.status(200).json(response); // Trả về kết quả
  } catch (error) {
    return res.status(500).json({
      err: 1,
      msg: 'fail at booking controller: ' + error
  });
  }
};

export const getBookingPendingApproval = async (req, res) => {
  const id = req.user.id
  try {
    const response = await services.getBookingPendingApprovalService(id);
    res.status(200).json(response); // Trả về kết quả
  } catch (error) {
    return res.status(500).json({
      err: 1,
      msg: 'fail at booking controller: ' + error
  });
  }
};

export const getBookedRoom = async (req, res) => {
  const id = req.user.id
  try {
    const response = await services.getBookedRoomService(id);
    res.status(200).json(response); // Trả về kết quả
  } catch (error) {
    return res.status(500).json({
      err: 1,
      msg: 'fail at booking controller: ' + error
  });
  }
};

export const getHistory = async (req, res) => {
  const id = req.user.id
  try {
    const response = await services.getHistoryService(id);
    res.status(200).json(response); // Trả về kết quả
  } catch (error) {
    return res.status(500).json({
      err: 1,
      msg: 'fail at booking controller: ' + error
  });
  }
};

export const approvalBooking = async (req, res) => {
  const {id} = req.params
  try {
    const response = await services.approvalBookingService(id);
    res.status(200).json(response); // Trả về kết quả
  } catch (error) {
    return res.status(500).json({
      err: 1,
      msg: 'fail at booking controller: ' + error
  });
  }
};

export const finishBooking = async (req, res) => {
  const {id} = req.params
  try {
    const response = await services.finishBookingService(id);
    res.status(200).json(response); // Trả về kết quả
  } catch (error) {
    return res.status(500).json({
      err: 1,
      msg: 'fail at booking controller: ' + error
  });
  }
};

export const getBookingDetail = async (req, res) => {
  const {id} = req.params
  try {
    const response = await services.getBookingDetailService(id);
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: 1,
      msg: 'fail at booking controller: ' + error
  });
  }
};

export const getBookedUserDetail = async (req, res) => {
  const {id} = req.params
  try {
    const response = await services.getBookedUserDetailService(id);
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: 1,
      msg: 'fail at booking controller: ' + error
  });
  }
};
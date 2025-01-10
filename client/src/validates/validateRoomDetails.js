// utils/validateRoomDetails.js

export const validateRoomDetails = (roomDetails) => {
    let invalidFields = [];

    // Kiểm tra các trường bắt buộc
    if (!roomDetails.tenPhong) {
        invalidFields.push({ name: 'tenPhong', message: 'Tên phòng là bắt buộc' });
    }
    if (!roomDetails.gia) {
        invalidFields.push({ name: 'gia', message: 'Giá phòng là bắt buộc' });
    }
    if (!roomDetails.dienTich) {
        invalidFields.push({ name: 'dienTich', message: 'Diện tích là bắt buộc' });
    }
    if (!roomDetails.soLuongPhong) {
        invalidFields.push({ name: 'soLuongPhong', message: 'Số lượng phòng là bắt buộc' });
    }
    if (!roomDetails.soLuongPhongTrong) {
        invalidFields.push({ name: 'soLuongPhongTrong', message: 'Số lượng phòng trống là bắt buộc' });
    }
    if (!roomDetails.diaChi) {
        invalidFields.push({ name: 'diaChi', message: 'Số đường là bắt buộc' });
    }
    if (!roomDetails.moTa) {
        invalidFields.push({ name: 'moTa', message: 'Mô tả phòng là bắt buộc' });
    }
    if (!roomDetails.tienCoc) {
        invalidFields.push({ name: 'tienCoc', message: 'Tiền cọc là bắt buộc' });
    }

    // Kiểm tra số lượng phòng trống không lớn hơn số lượng phòng
    if (parseInt(roomDetails.soLuongPhongTrong) > parseInt(roomDetails.soLuongPhong)) {
        invalidFields.push({ name: 'soLuongPhongTrong', message: 'Số lượng phòng trống không thể lớn hơn số lượng phòng' });
    }

    return invalidFields;
};

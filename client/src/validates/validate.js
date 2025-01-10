export const validate = (payload, setInvalidFields) => {
    let invalids = 0;
    const newInvalidFields = [];

    let fields = Object.entries(payload);
    fields.forEach(item => {
        if (item[1] === '') {
            newInvalidFields.push({
                name: item[0],
                message: 'Bạn không được bỏ trống trường này'
            });
            invalids++;
        }
    });

    fields.forEach(item => {
        switch (item[0]) {
            case 'matKhau':
                if (item[1].length < 6) {
                    newInvalidFields.push({
                        name: item[0],
                        message: 'Mật khẩu phải có tối thiểu 6 kí tự.'
                    });
                    invalids++;
                }
                break;
            case 'matKhauMoi':
                if (item[1].length < 6) {
                    newInvalidFields.push({
                        name: item[0],
                        message: 'Mật khẩu phải có tối thiểu 6 kí tự.'
                    });
                    invalids++;
                }
                if (payload.matKhauMoi === payload.matKhau) {
                    newInvalidFields.push({
                        name: item[0],
                        message: 'Mật khẩu mới phải khác mật khẩu cũ'
                    });
                    invalids++;
                }
                break;
            case 'xacNhanMatKhau':
                if (item[1].length < 6) {
                    newInvalidFields.push({
                        name: item[0],
                        message: 'Mật khẩu phải có tối thiểu 6 kí tự.'
                    });
                    invalids++;
                }
                if (payload.matKhau !== payload.xacNhanMatKhau) {
                    newInvalidFields.push({
                        name: item[0],
                        message: 'Mật khẩu mới và xác nhận mật khẩu không khớp.'
                    });
                    invalids++;
                }
                break;
            case 'xacNhanMatKhauMoi':
                if (item[1].length < 6) {
                    newInvalidFields.push({
                        name: item[0],
                        message: 'Mật khẩu phải có tối thiểu 6 kí tự.'
                    });
                    invalids++;
                }
                if (payload.matKhauMoi !== payload.xacNhanMatKhauMoi) {
                    newInvalidFields.push({
                        name: item[0],
                        message: 'Mật khẩu mới và xác nhận mật khẩu không khớp.'
                    });
                    invalids++;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(item[1])) {
                    newInvalidFields.push({
                        name: item[0],
                        message: 'Email không hợp lệ'
                    });
                    invalids++;
                }
                break;

            case 'SDT':
                const phoneRegex = /^(0|\+84)[0-9]{9}$/;
                if (!phoneRegex.test(item[1])) {
                    newInvalidFields.push({
                        name: item[0],
                        message: 'Số điện thoại không hợp lệ.'
                    });
                    invalids++;
                }
                break;
            case 'CCCD':
                const CCCDRegex = /^\d{12}$/;
                if (!CCCDRegex.test(item[1])) {
                    newInvalidFields.push({
                        name: item[0],
                        message: 'Số căn cước công dân không hợp lệ.'
                    });
                    invalids++;
                }
                break;
        }
    });

    // Cập nhật trạng thái với danh sách lỗi mới
    setInvalidFields(newInvalidFields);
    return invalids;
};

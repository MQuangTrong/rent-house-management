import pdf from "pdf-creator-node";
import path from 'path';

export const generatePDFService = (data) => new Promise(async (resolve, reject) => {
    try {
        const htmlTemplate = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
                        .content { margin-bottom: 10px; }
                    </style>
                </head>
                <body>
                    <div class="title">Chi Tiết Đặt Phòng</div>
                    <div class="content"><strong>Họ Tên:</strong> ${data.hoTen}</div>
                    <div class="content"><strong>Email:</strong> ${data.email}</div>
                    <div class="content"><strong>Số Điện Thoại:</strong> ${data.sdt}</div>
                    <div class="content"><strong>Giới Tính:</strong> ${data.gioiTinh}</div>
                    <div class="content"><strong>Ngày Đặt:</strong> ${data.ngayDat}</div>
                    <div class="content"><strong>Phòng Đặt:</strong> ${data.tenPhong}</div>
                </body>
            </html>
        `;

        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: '10mm',
        };

        const document = {
            html: htmlTemplate,
            data: data,
            path: path.join(__dirname, '../output', 'booking-detail.pdf'),
        };

        const result = await pdf.create(document, options);
        resolve({
            err: 0,
            msg: 'PDF created successfully',
            filePath: result.filename,
        });
    } catch (error) {
        reject({
            err: 1,
            msg: 'Có lỗi xảy ra trong quá trình tạo PDF.',
            error: error.message,
        });
    }
});
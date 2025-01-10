// controllers/pdfController.js
import { generatePDFService } from '../services/app.service';

export const createPDF = async (req, res) => {
    const data = req.body;
    try {
        const response = await generatePDFService(data);
        res.download(response.filePath, 'booking-detail.pdf');
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Lỗi khi tạo PDF: ' + error.msg,
        });
    }
};
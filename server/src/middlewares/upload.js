//file xu ly image
import path from 'path'
import multer from "multer";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve('src', 'public', 'images'))    //nhận ảnh tử FE về - đưa vào đây
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + Math.random().toString(36).substring(2, 15) + path.extname(file.originalname) //name image
        cb(null, fileName)
    }
})


export const upload = multer({ storage }) 
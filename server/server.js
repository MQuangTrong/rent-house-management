import express from "express"
require('dotenv').config()
import cors from 'cors'
import initRoutes from "./src/routes/"
import connectDatabase from "./src/config/connectDatabase"
import path from 'path';


const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "GET", "PATCH", "DELETE"]
}))

//2 câu lệnh cấu hình đọc được api từ client gửi lên
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true })); //Đọc form ở client gửi lên

app.use('/images', express.static('src/public/images'));

initRoutes(app)
connectDatabase()

const port = process.env.PORT || 8888
const listener = app.listen(port, () => {
    console.log(`Server is running on the port ${listener.address().port}`)
})
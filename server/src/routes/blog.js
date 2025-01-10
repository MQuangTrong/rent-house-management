import express from "express";

import * as blogController from "../controller/blog.controller"

const router = express.Router()
import verifyToken from "../middlewares/verifyToken";

router.get('/get-all-blog', blogController.getAllBlog)
router.get('/get-blog-lasted', blogController.getBlogLasted)
router.get('/get-blog-detail/:id', blogController.getBlogDetail)
router.get('/get-all-blog-deleted', blogController.getAllBlogDeleted)
router.post('/create-blog',verifyToken, blogController.createBlog)
router.get('/get-blog-edit/:id',verifyToken, blogController.getBlogEdit)
router.patch('/edit-blog/:id',verifyToken, blogController.editBlog)
router.patch('/delete-blog/:id',verifyToken, blogController.deleteBlog)
router.patch('/recover-blog/:id',verifyToken, blogController.recoverBlog)


export default router
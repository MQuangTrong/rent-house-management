import React, { useState, useEffect } from "react";
import * as services from "../../services";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const EditBlog = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [blog, setBlog] = useState({
        tieuDe: "",
        anh: "",
        noiDung: "",
    });

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const response = await services.apiGetEditBlog(id);
                console.log(response.data.blog);
                if (response.data.err === 0) {
                    const blogData = response.data.blog;
                    setBlog({
                        tieuDe: blogData.tieuDe,
                        anh: blogData.anh,
                        noiDung: blogData.noiDung,
                    });
                } else {
                    toast.error(response.data.msg || 'Không thể lấy dữ liệu bài viết');
                }
            } catch (error) {
                console.error('Error fetching blog details:', error);
                toast.error('Có lỗi xảy ra khi lấy thông tin bài viết');
            }
        };

        fetchBlogDetails();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlog((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("anh", file); // Gửi file qua API

            try {
                const response = await services.apiUploadImageProfile(formData); // Gọi API upload ảnh
                if (response.data.err === 0) {
                    const uploadedFilePath = response.data.filePath; // Lấy đường dẫn ảnh từ response
                    setBlog((prevState) => ({
                        ...prevState,
                        anh: uploadedFilePath, // Lưu đường dẫn ảnh vào payload
                    }));
                } else {
                    toast.error("Có lỗi xảy ra khi upload ảnh.");
                }
            } catch (error) {
                toast.error("Có lỗi xảy ra khi upload ảnh.");
            }
        }
    };

    const handleEditorChange = (content) => {
        setBlog(prev => ({
            ...prev,
            noiDung: content
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(id);
            console.log(blog);
            const response = await services.apiEditBlog(id, blog)
            if (response.data.err === 0) {
                toast.success(response.data.msg)
                navigate(`/quan-ly/quan-ly-bai-viet`)
            } else {
                toast.error(response.data.msg)
            }
        } catch (error) {
            console.error("Error adding room:", error);
        }

    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Thêm bài viết mới</h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
                        Tiêu đề
                    </label>
                    <input
                        id="title"
                        name="tieuDe"
                        type="text"
                        placeholder="Nhập tiêu đề bài viết"
                        value={blog.tieuDe}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
                        Ảnh
                    </label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2"
                    />
                    {blog.anh && (
                        <div className="mt-4">
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}${blog.anh}`}
                                alt="Blog Preview"
                                className="w-32 h-32 object-cover rounded"
                            />
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="content">
                        Nội dung
                    </label>
                    <Editor
                        apiKey='v7xtv0ev6cwkzgoubozd6oe0bx8bedwo75wvdof4nsp7jgd3'
                        value={blog.noiDung}
                        init={{
                            plugins: [
                                // Core editing features
                                'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                // Your account includes a free trial of TinyMCE premium features
                                // Try the most popular premium features until Jan 11, 2025:
                                'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                            ],
                            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                            tinycomments_mode: 'embedded',
                            tinycomments_author: 'Author name',
                            mergetags_list: [
                                { value: 'First.Name', title: 'First Name' },
                                { value: 'Email', title: 'Email' },
                            ],
                            ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                        }}

                        onEditorChange={handleEditorChange}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Sửa
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBlog;

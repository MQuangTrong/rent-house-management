import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as service from "../../services";
import DOMPurify from 'dompurify';

const BlogManagerDetail = () => {
    const { id } = useParams()
    console.log(id);
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await service.apiGetBlogDetail(id);
                console.log(response.data.blog);
                if (response.data.err === 0) {
                    setBlog(response.data.blog);
                } else {
                    console.error('Failed to fetch blogs');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleEdit = (id) => {
        navigate(`/quan-ly/sua-bai-viet/${id}`);
    };

    const handleBackClick = () => {
        navigate(-1); // Trở về trang trước đó
    };

    return (
        <div>
            <button
                onClick={handleBackClick}
                className="mb-4 text-secondary2 font-semibold flex items-center gap-2 p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-all"
            >
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5l-7 7 7 7" />
                </svg>
                Trở về
            </button>
            <div className="flex justify-center items-center w-full bg-gray-100 mt-8">

                {loading ? (
                    <p>Đang tải...</p>
                ) : (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden w-3/4">
                        <h1 className="text-2xl font-bold mb-4 text-gray-800 p-6 text-center">{blog.tieuDe}</h1>
                        <img
                            src={`${process.env.REACT_APP_SERVER_URL}${blog.anh}`}
                            alt={blog.tieuDe}
                            className="w-3/5 h-80 object-cover m-auto"
                        />
                        <div
                            className="description p-12 px-28 text-justify"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(blog?.noiDung),
                            }}
                        />
                    </div>)}
            </div>
            <div className="flex justify-center mt-6">
                <button
                    className="px-8 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={() => handleEdit(blog.id)}
                >
                    Sửa
                </button>
            </div>
        </div>

    );
};

export default BlogManagerDetail;

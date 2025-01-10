import React, { useState, useEffect } from "react";
import * as service from "../../services";
import { Link, useSearchParams } from 'react-router-dom';
import { Pagination } from "../../components";

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [blogLoading, setBlogLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const blogsPerPage = 6;

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await service.apiGetAllBlog();
                if (response.data.err === 0) {
                    setBlogs(response.data.result);
                } else {
                    console.error('Failed to fetch blogs');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setBlogLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const totalPages = Math.ceil(blogs.length / blogsPerPage);

    const handlePageChange = (pageNumber) => {
        setSearchParams({ page: pageNumber });
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Mượt mà khi cuộn
        });
    }, [currentPage]);

    return (
        <div className="w-full">
            <div className="bg-white p-4 mt-8 ">
                {blogLoading ? (
                    <p>Đang tải...</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {currentBlogs.length === 0 ? (
                                <div className="text-center py-4">Không có phòng nào.</div>
                            ) : (
                                currentBlogs.map((blog) => (
                                    <Link
                                        to={`/chi-tiet-blog/${blog.id}`}
                                        key={blog.id}
                                        className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                    >
                                        <img
                                            src={`${process.env.REACT_APP_SERVER_URL}${blog.anh}`}
                                            alt={blog.tieuDe}
                                            className="w-full h-40 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{blog.tieuDe}</h3>
                                            <p className="text-gray-600 text-sm line-clamp-3">{blog.noiDung}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
            {/* Phân trang ở dưới */}
            <div className="mt-8 flex justify-center">
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>

    );
};

export default Blog;

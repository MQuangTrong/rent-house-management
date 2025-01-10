import React, { useEffect, useState } from "react";
import * as service from "../../services";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Pagination } from "../../components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DOMPurify from 'dompurify';


const MySwal = withReactContent(Swal);

const BlogManager = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("");
    const currentPage = Number(searchParams.get("page")) || 1;
    const blogsPerPage = 5;

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await service.apiGetBlogLasted();
                if (response.data.err === 0) {
                    setBlogs(response.data.result);
                    setFilteredBlogs(response.data.result);
                } else {
                    console.error("Failed to fetch blogs");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    useEffect(() => {
        const filtered = blogs.filter((blog) =>
            blog.tieuDe.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBlogs(filtered);
    }, [searchTerm, blogs]);

    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

    const handlePageChange = (pageNumber) => {
        setSearchParams({ page: pageNumber });
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [currentPage]);

    const handleDetail = (id) => {
        navigate(`/quan-ly/chi-tiet-bai-viet/${id}`)
    };

    const handleEdit = (id) => {
        navigate(`/quan-ly/sua-bai-viet/${id}`)
    };

    const handleDelete = async (id) => {
        const result = await MySwal.fire({
            title: "Xác nhận xóa bài viết",
            text: `Bạn có chắc chắn muốn xóa bài viết này?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                const response = await service.apiDeleteBlog(id);
                console.log(response);
                if (response.data.err === 0) {
                    toast.success(response.data.msg);
                    // Cập nhật danh sách tài khoản sau khi khóa
                    const updatedBlogs = await service.apiGetBlogLasted();
                    setBlogs(updatedBlogs.data.result);
                } else {
                    toast.error(`Không thể xóa bài viết: ${response.data.msg}`);
                }
            } catch (error) {
                toast.error(`Lỗi khi xóa bài viết: ${error.message}`);
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Quản lý Blog</h1>
            {/* Input tìm kiếm */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm blog theo tiêu đề..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="border border-gray-300 p-2">STT</th>
                            <th className="border border-gray-300 p-2">Tiêu đề</th>
                            <th className="border border-gray-300 p-2">Ảnh</th>
                            <th className="border border-gray-300 p-2">Nội dung</th>
                            <th className="border border-gray-300 p-2 text-center">Chức năng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : currentBlogs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    Không có blog nào.
                                </td>
                            </tr>
                        ) : (
                            currentBlogs.map((blog, index) => (
                                <tr key={blog.id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 p-2 text-center">
                                        {indexOfFirstBlog + index + 1}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {blog.tieuDe.length > 50
                                            ? blog.tieuDe.substring(0, 50) + "..."
                                            : blog.tieuDe}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <img
                                            src={`${process.env.REACT_APP_SERVER_URL}${blog.anh}`}
                                            alt={blog.tieuDe}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <div
                                            className="description"
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(blog.noiDung.length > 50
                                                    ? blog.noiDung.substring(0, 120) + "..."
                                                    : blog.noiDung),
                                            }}
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center flex gap-2">
                                        <button
                                            onClick={() => handleDetail(blog.id)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
                                        >
                                            Chi tiết
                                        </button>
                                        <button
                                            onClick={() => handleEdit(blog.id)}
                                            className="px-3 py-1 bg-green-500 text-white rounded-md mr-2 hover:bg-green-600"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default BlogManager;

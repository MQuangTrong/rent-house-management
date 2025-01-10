import React, { useState, useEffect } from "react";
import * as service from "../../services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";  // Import SweetAlert2
import "sweetalert2/dist/sweetalert2.min.css";

const ApprovePost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApprovePosts = async () => {
            try {
                const response = await service.apiPenddingApprovePost();
                if (response.data.err === 0) {
                    setPosts(response.data.result);
                } else {
                    console.error("Failed to fetch posts");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovePosts();
    }, []);

    const handleApprove = async (id) => {
        try {
            const response = await service.apiApprovePost(id);
            if (response.data.err === 0) {
                if (response.data.msg.includes("Bài đăng đã được phê duyệt thành công")) {
                    toast.success(response.data.msg);

                    // Cập nhật trạng thái bài đăng trong `posts` sau khi duyệt
                    setPosts(posts.filter(post => post.id !== id));  // Xóa bài đăng đã duyệt khỏi danh sách
                } else {
                    toast.error(response.data.msg);
                }
            } else {
                console.error('Failed to approve host');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async (id) => {
        // Show confirmation dialog before rejecting
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn từ chối bài đăng này?',
            text: "Bạn sẽ không thể phục hồi hành động này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Từ chối',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            try {
                const response = await service.apiRejectPost(id);
                if (response.data.err === 0) {
                    if (response.data.msg.includes("Bài đăng đã bị từ chối")) {
                        toast.success(response.data.msg);  // Show toast notification on success

                        // Cập nhật trạng thái bài đăng trong `posts` sau khi từ chối
                        setPosts(posts.filter(post => post.id !== id));  // Xóa bài đăng đã từ chối khỏi danh sách
                    } else {
                        toast.error(response.data.msg);  // Show toast notification on error
                    }
                } else {
                    console.error('Failed to reject host');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-secondary mb-4 text-secondary2">Duyệt bài đăng</h2>
            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : posts.length === 0 ? (
                <div className="text-center text-xl text-gray-600">
                    Không có bài đăng nào cần duyệt.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-secondary2 text-white">
                                <th className="border border-gray-300 px-4 py-2">STT</th>
                                <th className="border border-gray-300 px-4 py-2">Tên Phòng</th>
                                <th className="border border-gray-300 px-4 py-2">Giá Phòng</th>
                                <th className="border border-gray-300 px-4 py-2">Diện Tích</th>
                                <th className="border border-gray-300 px-4 py-2">Địa Chỉ</th>
                                <th className="border border-gray-300 px-4 py-2">Chủ Trọ</th>
                                <th className="border border-gray-300 px-4 py-2">Hình Ảnh</th>
                                <th className="border border-gray-300 px-4 py-2">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post, index) => (
                                <tr key={post.id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">{post.tenPhong}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-green-500">{post.gia}</td>
                                    <td className="border border-gray-300 px-4 py-2">{post.dienTich} m²</td>
                                    <td className="border border-gray-300 px-4 py-2">{post.diaChi}</td>
                                    <td className="border border-gray-300 px-4 py-2">{post.hoTen}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {post.anh.length > 0 && (
                                            <div className="relative w-16 h-16">
                                                <img
                                                    src={`${process.env.REACT_APP_SERVER_URL}${post.anh[0]}`}
                                                    alt={post.tenPhong}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                                {post.anh.length > 1 && (
                                                    <span className="absolute bottom-0 right-0 bg-black text-white text-xs p-1 rounded-full">
                                                        +{post.anh.length - 1}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center flex">
                                        <button
                                            className="bg-blue-500 text-white p-2 rounded-md mr-2"
                                            onClick={() => handleApprove(post.id)}
                                        >
                                            Duyệt
                                        </button>
                                        <button
                                            className="bg-red-500 text-white p-2 rounded-md"
                                            onClick={() => handleReject(post.id)}
                                        >
                                            Từ chối
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ApprovePost;

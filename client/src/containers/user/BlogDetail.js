import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as service from "../../services";
import DOMPurify from 'dompurify';

const BlogDetail = () => {
    const { id } = useParams()
    console.log(id);
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState([]);

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

    return (
        <div className="flex justify-center items-center w-full bg-gray-100 mt-8">
            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800 p-6 text-center">{blog.tieuDe}</h1>
                    <img
                        src={`${process.env.REACT_APP_SERVER_URL}${blog.anh}`}
                        alt={blog.tieuDe}
                        className="w-3/5 h-80 object-cover m-auto"
                    />
                    <div
                        className="leading-relaxed p-12 px-28 text-justify"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(blog?.noiDung),
                        }}
                    />
                </div>)}
        </div>
    );
};

export default BlogDetail;

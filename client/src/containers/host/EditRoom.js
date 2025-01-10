import React, { useState, useEffect } from "react";
import FormInput from "../../components/FormInput";
import { Button } from "../../components";
import * as services from '../../services';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { validateRoomDetails } from "../../validates/validateRoomDetails";
import { useNavigate } from "react-router-dom"
import { path } from "../../ultils/constant"
import { useParams } from "react-router-dom";

const EditRoom = () => {
    const { id } = useParams();
    const [roomDetails, setRoomDetails] = useState({
        tenPhong: '',
        gia: '',
        dienTich: '',
        soLuongPhong: '',
        soLuongPhongTrong: '',
        district: '',
        ward: '',
        diaChi: '',
        anh: [],
        moTa: '',
        tienCoc: ''
    });
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [invalidFields, setInvalidFields] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await services.apiGetRoomEdit(id);
                console.log(response.data.result);
                if (response.data.err === 0) {
                    const roomData = response.data.result;
                    setRoomDetails({
                        tenPhong: roomData.tenPhong,
                        gia: roomData.giaPhong,
                        dienTich: roomData.dienTich,
                        soLuongPhong: roomData.soLuongPhong,
                        soLuongPhongTrong: roomData.soLuongPhongTrong,
                        district: roomData.district || '',
                        ward: roomData.ward || '',
                        diaChi: roomData.diaChi,
                        anh: roomData.anh,
                        moTa: roomData.moTa,
                        tienCoc: roomData.tienCoc,
                    });
                } else {
                    toast.error(response.data.msg || 'Không thể lấy dữ liệu phòng');
                }
            } catch (error) {
                console.error('Error fetching room details:', error);
                toast.error('Có lỗi xảy ra khi lấy thông tin phòng');
            }
        };
    
        fetchRoomDetails();
    }, []);
    

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const response = await services.apiDistrict();
                setDistricts(response.data.response);
            } catch (error) {
                console.error("Error fetching districts:", error);
            }
        };
        fetchDistricts();
    }, []);

    useEffect(() => {
        if (roomDetails.district) {
            const fetchWards = async () => {
                try {
                    const response = await services.apiWard(roomDetails.district);
                    setWards(response.data.response);
                } catch (error) {
                    console.error("Error fetching wards:", error);
                }
            };
            fetchWards();
        } else {
            setWards([]);
        }
    }, [roomDetails.district]);

    const handleDistrictChange = (e) => {
        const selectedDistrict = e.target.value;
        setRoomDetails(prev => ({
            ...prev,
            district: selectedDistrict,
            ward: ''
        }));
    };

    const handleWardChange = (e) => {
        const selectedWard = e.target.value;
        setRoomDetails(prev => ({
            ...prev,
            ward: selectedWard
        }));
    };

    const handleImageDelete = (index) => {
        const newImages = roomDetails.anh.filter((_, idx) => idx !== index);
        setRoomDetails(prev => ({
            ...prev,
            anh: newImages
        }));
    };

    // Upload ảnh
    const handleImageChange = async (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const formData = new FormData();
            for (const file of files) {
                formData.append('anh', file); // Gửi nhiều file qua API
            }

            try {
                const response = await services.apiUploadImages(formData);
                if (response.data.err === 0) {
                    const uploadedFilePaths = response.data.filePaths;

                    setRoomDetails(prev => ({
                        ...prev,
                        anh: [...prev.anh, ...uploadedFilePaths] // Cập nhật danh sách ảnh
                    }));
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra khi upload ảnh.');
            }
        }
    };


    const handleEditorChange = (content) => {
        setRoomDetails(prev => ({
            ...prev,
            moTa: content
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const invalidFields = validateRoomDetails(roomDetails);

        if (invalidFields.length > 0) {
            setInvalidFields(invalidFields);
            return;
        }

        try {
            // Xử lý gửi dữ liệu (API hoặc logic khác)
            const response = await services.apiEditRoom(id, roomDetails)
            if (response.data.err === 0) {
                if (response.data.msg.includes("Đã cập nhập thành công")) {
                    toast.success(response.data.msg)
                    navigate(`${path.HOST}/danh-sach-phong-tro`)
                } else {
                    toast.error(response.data.msg)
                }
            }
        } catch (error) {
            console.error("Error adding room:", error);
        }
    };


    return (
        <div className="container mx-auto w-3/4">
            <h2 className="text-2xl font-bold mb-4">Sửa Phòng Trọ</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Tên Phòng */}
                    <div className="p-4 bg-white shadow-md rounded-md border border-gray-200">
                        <FormInput
                            label="Tên Phòng"
                            value={roomDetails.tenPhong}
                            setValue={setRoomDetails}
                            keyName="tenPhong"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            type="text"
                        />
                    </div>

                    {/* Giá Phòng */}
                    <div className="p-4 bg-white shadow-md rounded-md border border-gray-200">
                        <FormInput
                            label="Giá Phòng"
                            value={roomDetails.gia}
                            setValue={setRoomDetails}
                            keyName="gia"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            type="text"
                        />
                    </div>

                    {/* Diện Tích */}
                    <div className="p-4 bg-white shadow-md rounded-md border border-gray-200">
                        <FormInput
                            label="Diện Tích"
                            value={roomDetails.dienTich}
                            setValue={setRoomDetails}
                            keyName="dienTich"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            type="text"
                        />
                    </div>

                    {/* Số Lượng Phòng */}
                    <div className="p-4 bg-white shadow-md rounded-md border border-gray-200">
                        <FormInput
                            label="Số Lượng Phòng"
                            value={roomDetails.soLuongPhong}
                            setValue={setRoomDetails}
                            keyName="soLuongPhong"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            type="text"
                        />
                    </div>

                    {/* Số Lượng Phòng Trống */}
                    <div className="p-4 bg-white shadow-md rounded-md border border-gray-200">
                        <FormInput
                            label="Số Lượng Phòng Trống"
                            value={roomDetails.soLuongPhongTrong}
                            setValue={setRoomDetails}
                            keyName="soLuongPhongTrong"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            type="text"
                        />
                    </div>

                    {/* Tiền Cọc */}
                    <div className="p-4 bg-white shadow-md rounded-md border border-gray-200">
                        <FormInput
                            label="Tiền Cọc"
                            value={roomDetails.tienCoc}
                            setValue={setRoomDetails}
                            keyName="tienCoc"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            type="text"
                        />
                    </div>

                </div>

                {/* Quận và Phường */}
                <div className="p-4 bg-white shadow-md rounded-md border border-gray-200">
                    <div className="flex space-x-4">
                        <div className="w-full">
                            <label htmlFor="district" className="block text-sm font-medium text-gray-700">Quận</label>
                            <select
                                id="district"
                                name="district"
                                value={roomDetails.district}
                                onChange={handleDistrictChange}
                                className="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Chọn Quận</option>
                                {districts.map((district) => (
                                    <option key={district.id} value={district.id}>{district.tenQuan}</option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full">
                            <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Phường</label>
                            <select
                                id="ward"
                                name="ward"
                                value={roomDetails.ward}
                                onChange={handleWardChange}
                                className="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Chọn Phường</option>
                                {wards.map((ward) => (
                                    <option key={ward.id} value={ward.id}>{ward.tenPhuong}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Số Đường */}
                <div className="p-4 bg-white shadow-md rounded-md border border-gray-200">
                    <FormInput
                        label="Số Đường"
                        value={roomDetails.diaChi}
                        setValue={setRoomDetails}
                        keyName="diaChi"
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        type="text"
                    />
                </div>

                {/* Ảnh Phòng */}
                <div className="p-4 bg-white shadow-md rounded-md border border-gray-200">
                    <label htmlFor="anh" className="block text-sm font-medium text-gray-700">Ảnh Phòng</label>
                    <input
                        type="file"
                        id="anh"
                        name="anh"
                        multiple
                        onChange={handleImageChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div className="mt-2">
                        {roomDetails.anh.map((image, index) => (
                            <div key={index} className="inline-block mr-2 relative">
                                <img
                                    src={`${process.env.REACT_APP_SERVER_URL}${image}`}
                                    alt={`image-${index}`}
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleImageDelete(index)}
                                    className="absolute top-0 right-0 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    <span className="text-xs">X</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mô Tả Phòng */}
                <div className="p-4 bg-white shadow-md rounded-md border border-gray-200">
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">Mô Tả Phòng</label>
                    <Editor
                        apiKey='v7xtv0ev6cwkzgoubozd6oe0bx8bedwo75wvdof4nsp7jgd3'
                        value={roomDetails.moTa}
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

                {/* Nút Submit */}
                <div className="flex justify-center">
                    <Button
                        text="Sửa Phòng"
                        textColor="text-white"
                        bgColor="bg-secondary2"
                        onClick={handleSubmit}
                    />
                </div>
            </form>
        </div>
    );
};

export default EditRoom;

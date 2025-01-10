import React, { useState, useEffect } from "react";
import { Button } from "../../components";
import * as services from '../../services'

const Search = ({ onFilterChange }) => {

    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [price, setPrice] = useState('');
    const [area, setArea] = useState('');

    useEffect(() => {
        // Lấy danh sách quận
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
        if (district) {
            // Lấy danh sách huyện theo quận
            const fetchWards = async () => {
                try {
                    const response = await services.apiWard(district);
                    setWards(response.data.response);
                } catch (error) {
                    console.error("Error fetching wards:", error);
                }
            };
            fetchWards();
        } else {
            setWards([]); // Xóa danh sách huyện nếu không chọn quận
        }
    }, [district]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'district') {
            setDistrict(value);
    
            if (value === '') {
                // Khi chọn "Tất cả quận", xóa phường và cập nhật URL
                setWard('');
                onFilterChange({ district: value, ward: '', price, area });
            } else {
                // Nếu chọn quận cụ thể, giữ các giá trị khác
                onFilterChange({ district: value, ward: '', price, area });
            }
        }
    
        if (name === 'ward') {
            setWard(value);
            onFilterChange({ district, ward: value, price, area });
        }
        if (name === 'price') {
            setPrice(value);
            onFilterChange({ district, ward, price: value, area });
        }
        if (name === 'area') {
            setArea(value);
            onFilterChange({ district, ward, price, area: value });
        }
    };
    

    // const handleFilter = () => {
    //     // Gọi API với các bộ lọc đã chọn
    //     const filters = { district, ward, price, area };
    //     onFilterChange(filters);
    // };

    return (
        <div>
            {/* Card lọc */}
            <div className="w-1100 mx-auto bg-white rounded-lg shadow-md mb-8 mt-8">
                <div className="bg-[#E4DECE]">
                    <h3 className="text-xl font-semibold py-2 px-4 text-black">Lọc Phòng Trọ</h3>
                </div>

                <div className="p-4 bg-white">
                    <div className="flex justify-between align-center gap-4">
                        <div className="flex-1">
                            <label className="block text-lg font-medium">Chọn Quận</label>
                            <select
                                name="district"
                                value={district}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Tất cả quận</option>
                                {districts.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.tenQuan}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-lg font-medium">Chọn Phường</label>
                            <select
                                name="ward"
                                value={ward}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Tất cả phường</option>
                                {wards.map((w) => (
                                    <option key={w.id} value={w.id}>
                                        {w.tenPhuong}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-lg font-medium">Chọn Giá</label>
                            <select
                                name="price"
                                value={price}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Tất cả mức giá</option>
                                <option value="0-2">Dưới 2 triệu</option>
                                <option value="2-4">2 triệu - 4 triệu</option>
                                <option value="4-6">4 triệu - 6 triệu</option>
                                <option value="6+">Trên 6 triệu</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-lg font-medium">Chọn Diện Tích</label>
                            <select
                                name="area"
                                value={area}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Tất cả diện tích</option>
                                <option value="0-20">Dưới 20m²</option>
                                <option value="20-30">20m² - 30m²</option>
                                <option value="30-50">30m² - 50m²</option>
                                <option value="50+">Trên 50m²</option>
                            </select>
                        </div>

                        {/* <div className="flex items-end justify-center">
                            <Button
                                text={'Lọc'}
                                textColor={'text-white'}
                                bgColor={'bg-secondary2'}
                                onClick={handleFilter}
                            />
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search
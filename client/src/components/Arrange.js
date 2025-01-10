import React, { useState } from "react";

const Arrange = ({ onSortChange }) => {
  const [selected, setSelected] = useState(""); // Trạng thái lưu giá trị được chọn

  const handleSort = (e) => {
    const value = e.target.value;
    setSelected(value); // Cập nhật giá trị được chọn
    onSortChange(value); // Gửi giá trị sắp xếp lên component cha
  };

  return (
    <div className="bg-secondary1 shadow-md rounded-lg p-4">
      <h4 className="font-semibold text-lg mb-4">Sắp xếp</h4>
      <select
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selected}
        onChange={handleSort}
      >
        <option value="" disabled>
          Chọn sắp xếp
        </option>
        <option value="giaPhong">Theo giá</option>
        <option value="dienTich">Theo diện tích</option>
        <option value="tenPhong">Theo tên</option>
      </select>
    </div>
  );
};

export default Arrange;

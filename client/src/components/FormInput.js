import React from "react";

const FormInput = ({ label, value, setValue, type, keyName, invalidFields, setInvalidFields, readOnly }) => {

    const handleFocus = () => {
        // Xóa lỗi cho trường đang focus
        setInvalidFields(prev => prev.filter(i => i.name !== keyName));
    };

    return (
        <div>
            <label htmlFor={type} className="block text-secondary2 font-medium mb-2 ">{label}</label>
            <input
                type={type}
                id={keyName}
                placeholder={label}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={value}
                onChange={(e) => setValue(prev => ({ ...prev, [keyName]: e.target.value }))}
                onFocus={handleFocus}
                readOnly = {readOnly}
            />
            {invalidFields.length > 0 && invalidFields.some(i => i.name === keyName) && <span className="text-red-500 italic">{invalidFields.find(i => i.name === keyName)?.message}</span>}
        </div>
    )
}

export default FormInput
import React, { memo } from "react";

const Button = ({ text, textColor, bgColor, IcAfter, onClick, fullWidth }) => {

    return (
        <button
            type='button'
            className={`px-6 py-2 ${textColor} ${bgColor} ${fullWidth ? 'w-full' : ''} hover:opacity-80 outline-none rounded-md flex justify-center items-center gap-1`}
            onClick={onClick}
        >
            <span>{text}</span>
            {IcAfter && <IcAfter />}
        </button>
    )
}

export default memo(Button)
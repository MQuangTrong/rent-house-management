import React from "react";
import SibeBar from "./SibeBar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const HomeSystem = () => {
    return (

        
    <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex">
            <SibeBar />
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
                <Outlet />
            </div>
        </div>
    </div>
    );
};

export default HomeSystem;

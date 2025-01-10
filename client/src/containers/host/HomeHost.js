import React from "react";
import Header from './Header';
import { Outlet } from "react-router-dom";
import SidebarHost from "./SidebarHost";;
const HomeHost = () => {
    return (
        <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex">
            <SidebarHost />
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
                <Outlet />
            </div>
        </div>
    </div>
    )
}

export default HomeHost

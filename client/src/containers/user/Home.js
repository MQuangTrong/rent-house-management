import React from "react";
import Header from './Header';
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Home = () => {


    return (
        <div className="w-full m-auto h-full">
            <Header />
            <div className="w-1100 flex flex-col items-center justify-center m-auto mt-24">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Home
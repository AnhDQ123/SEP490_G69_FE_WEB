
import {Outlet} from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

const Layout = () => {

    return (
        <>
            <Navbar></Navbar>
            <div className="flex items-start pt-16">
                <Sidebar></Sidebar>
                <main className="overflow-y-auto relative w-full h-full bg-gray-50 dark:bg-gray-900 lg:ml-64">
                    <Outlet/>
                </main>
            </div>
        </>
);
};
export default Layout;
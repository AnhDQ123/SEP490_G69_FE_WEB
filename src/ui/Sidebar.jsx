import {NavLink} from "react-router-dom";
import {RiDashboardFill} from "react-icons/ri";
import {IoMdSettings} from "react-icons/io";
import {HiAdjustments} from "react-icons/hi";
import {GrFormNext, GrLanguage} from "react-icons/gr";
import {FaUserGroup} from "react-icons/fa6";
import {useState} from "react";
import {FaChevronDown} from "react-icons/fa";


function Sidebar() {
    const [userDropdown, setUserDropdown] = useState(false);
    return (
        <div className="lg:!block hidden">
            <aside aria-label="Sidebar with multi-level dropdown example"
                   className="flex fixed top-0 left-0 z-20 flex-col flex-shrink-0 pt-16 h-full duration-75 border-r border-gray-200 lg:flex transition-width dark:border-gray-700 w-64">
                <div className="h-full overflow-y-auto overflow-x-hidden rounded bg-white py-4 px-3 dark:bg-gray-800">
                    <div className="flex h-full flex-col justify-between py-2">
                        <div>
                            <form className="pb-3 md:hidden">
                                <div className="flex">
                                    <div className="relative w-full">
                                        <div
                                            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <svg stroke="currentColor" fill="currentColor"  
                                                 viewBox="0 0 20 20"
                                                 className="h-5 w-5 text-gray-500 dark:text-gray-400" height="1em"
                                                 width="1em" xmlns="http://www.w3.org/2000/svg">
                                                <path  
                                                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                       ></path>
                                            </svg>
                                        </div>
                                        <input
                                            className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 pl-10 rounded-lg p-2.5 text-sm"
                                            type="search" placeholder="Search" required="" size="32"/></div>
                                </div>
                            </form>
                            <div className="" data-testid="flowbite-sidebar-items">
                                <ul className="mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700"
                                    data-testid="flowbite-sidebar-item-group">
                                    <li>
                                        <NavLink to={"/"} aria-labelledby="flowbite-sidebar-item-:r6:"
                                           className="flex items-center justify-center rounded-lg p-2 text-base font-medium text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                           href="/">
                                            <RiDashboardFill className="text-2xl" />
                                            <span className="px-3 flex-1 whitespace-nowrap"
                                                  data-testid="flowbite-sidebar-item-content"
                                                  id="flowbite-sidebar-item-:r6:">

                                                Dashboard
                                            </span>
                                        </NavLink>
                                    </li>
                                   <li>
                                        <button onClick={()=>setUserDropdown(!userDropdown)}
                                            className="group flex w-full items-center rounded-lg p-2 text-base font-medium text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                            id="flowbite-sidebar-collapse-:rd:" title="Employees" type="button">

                                            <FaUserGroup className="text-2xl"/>
                                            <span className="ml-3 flex-1 whitespace-nowrap text-left"
                                                  data-testid="flowbite-sidebar-collapse-label">Employees</span>
                                            { !userDropdown ? <GrFormNext className="text-2xl"/>: <FaChevronDown />}
                                        </button>
                                       { userDropdown &&  <ul aria-labelledby="flowbite-sidebar-collapse-:rd:" className="space-y-2 py-2">
                                            <li>
                                                <NavLink to="/employees" aria-labelledby="flowbite-sidebar-item-:r1n:"
                                                   className="flex items-center justify-center rounded-lg p-2 text-base font-medium text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group w-full pl-8 transition duration-75 bg-gray-100 dark:bg-gray-700">
                                                    <span className="px-3 flex-1 whitespace-nowrap" data-testid="flowbite-sidebar-item-content"
                                                                            id="flowbite-sidebar-item-:r1n:">
                                                        Employees list
                                                    </span>
                                                </NavLink>
                                            </li>
                                        </ul>
                                       }
                                    </li>

                                </ul>

                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-x-5">
                            <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"><span
                                className="sr-only">Tweaks</span>
                                <HiAdjustments className="text-2xl"/>
                            </button>
                            <div>
                                <div className="w-fit" data-testid="flowbite-tooltip-target">
                                    <a href="/users/settings" className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white">
                                        <span  className="sr-only">Settings page</span>
                                        <IoMdSettings className="text-2xl"/>
                                    </a>
                                </div>
                                <div data-testid="flowbite-tooltip" tabIndex="-1"
                                     className="absolute inline-block z-10 rounded-lg py-2 px-3 text-sm font-medium shadow-sm transition-opacity duration-300 invisible opacity-0 bg-gray-900 text-white dark:bg-gray-700"
                                     id=":r10:" role="tooltip"
                                     style={{position: "absolute", top: "892.8px", left: "65.8065px"}}>
                                    <div className="relative z-20">Settings page</div>
                                    <div className="absolute z-10 h-2 w-2 rotate-45 bg-gray-900 dark:bg-gray-700"
                                         data-testid="flowbite-tooltip-arrow"
                                         style={{bottom: "-4px", left: "51.5px"}}>&nbsp;</div>
                                </div>
                            </div>
                            <div>
                                <div className="w-fit dark:text-white" data-testid="flowbite-tooltip-target">
                                    <button className="flex items-center">
                                        <span className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white">
                                            <span className="sr-only">Current language</span>
                                            <GrLanguage className="text-lg" />
                                        </span>
                                    </button>
                                </div>
                                <div data-testid="flowbite-tooltip" tabIndex="-1"
                                     className="z-10 w-fit rounded-xl divide-y divide-gray-100 shadow transition-opacity duration-100 invisible opacity-0 border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white"
                                     id=":r12:" role="tooltip" style={{position: "absolute", top: "769.2px", left: "161.2px"}}>
                                    <div className="rounded-xl text-sm text-gray-700 dark:text-gray-200">
                                        <ul className="">
                                            <ul className="py-1" role="none">
                                                <li>
                                                    <a href="#"
                                                       className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                                                    <div className="inline-flex items-center">
                                                        <span className="whitespace-nowrap">English (US)</span></div>

                                                    </a>
                                                </li>
                                                <li><a href="#"
                                                       className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                                                    <div className="inline-flex items-center">
                                                        Deutsch
                                                    </div>
                                                </a></li>
                                                <li><a href="#"
                                                       className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                                                    <div className="inline-flex items-center">

                                                        Italiano
                                                    </div>
                                                </a></li>
                                                <li><a href="#"
                                                       className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                                                    <div className="inline-flex items-center">
                                                        <span className="whitespace-nowrap">中文 (繁體)</span></div>
                                                </a></li>
                                            </ul>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}

export default Sidebar;
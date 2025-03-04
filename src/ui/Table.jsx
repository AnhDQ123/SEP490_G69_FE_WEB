import {FaEdit, FaRegTrashAlt} from "react-icons/fa";
import Spin from "./Spin.jsx";
import {NavLink} from "react-router-dom";
import error from "eslint-plugin-react/lib/util/error.js";
import {useState} from "react";

function Table({data, isLoading, error}) {
    const [checked, setChecked] = useState(false);
    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow">
                        <div data-testid="table-element"
                             className="relative overflow-x-auto shadow-md sm:rounded-lg">

                            <table
                                className="w-full text-left text-sm text-gray-500 dark:text-gray-400 min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                <thead
                                    className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3"><label
                                        className="text-sm font-medium text-gray-900 dark:text-gray-300 sr-only"
                                        htmlFor="select-all">Select all</label>
                                        <input
                                            className="h-4 w-4 rounded border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                                            type="checkbox" id="select-all" name="select-all"
                                            checked={checked}
                                            onClick={() => setChecked((checked) => !checked)}/>
                                    </th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Phone</th>
                                    <th className="px-6 py-3">Address</th>
                                    <th className="px-6 py-3">Department</th>
                                    <th className="px-6 py-3">Username</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                                </thead>

                                {data && ( <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {data?.map((item, index) => (<tr key={item.employeeId} data-testid="table-row-element"
                                                                 className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 w-4 p-4">
                                            <div className="flex items-center">
                                                <input checked={checked}
                                                       className="h-4 w-4 rounded border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                                                       type="checkbox" aria-describedby="checkbox-1"
                                                       id="checkbox-1" value={item.id}/><label htmlFor="checkbox-1"
                                                                                               className="sr-only">checkbox</label>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
                                            <img className="h-10 w-10 rounded-full"
                                                 src={item.avatar} alt={item.firstname+" "+item.lastname}/>
                                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                                <div
                                                    className="text-base font-semibold text-gray-900 dark:text-white">
                                                    {item.firstname + " " + item.lastname}
                                                </div>
                                                <div
                                                    className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                                    {item.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                            {item.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                            {item.address+", "+item.city+", "+ item.country}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                            {item.department}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                            {item.username}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
                                            <div className="flex items-center">
                                                <div className=" rounded-full bg-green-400  text-center" style={{width:"70px"}}>
                                                    {item.role}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-x-3 whitespace-nowrap">
                                                <NavLink to={"/users/" + item.employeeId}
                                                         className="text-white bg-blue-900 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 focus:!ring-2 p-0 font-medium rounded-lg">
                                                <span className="flex items-center rounded-md text-sm px-3 py-2">
                                                    <div className="flex items-center gap-x-2">
                                                        <FaEdit/>
                                                        Edit user
                                                    </div>
                                                </span>
                                                </NavLink>
                                                <NavLink to={"/users/" + item.id}
                                                         className="text-white bg-red-700 border border-transparent hover:bg-red-800 focus:ring-4 focus:ring-red-300 disabled:hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 dark:disabled:hover:bg-red-600 focus:!ring-2 p-0 font-medium rounded-lg">
                                                <span className="flex items-center rounded-md text-sm px-3 py-2">
                                                    <div className="flex items-center gap-x-2">
                                                        <FaRegTrashAlt/>
                                                    Delete user
                                                    </div>
                                                </span>
                                                </NavLink>
                                            </div>
                                        </td>
                                    </tr>
                                ))}


                                </tbody>)}
                            </table>

                            {isLoading && <Spin></Spin>}
                            {error && <p className="text-center font-bold text-red-500">Cannot found any data!</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default Table;
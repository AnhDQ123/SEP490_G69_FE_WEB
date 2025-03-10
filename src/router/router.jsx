import {createBrowserRouter} from "react-router-dom";
import {lazy} from "react";
import {ProtectRouter} from "../ui/ProtectRouter.jsx";

const LayoutLazy = lazy(() => import("../ui/Layout.jsx"));
const ErrorPageLazy = lazy(() => import("../page/error/ErrorPage.jsx"));
const DashboardLazy = lazy(() => import("../page/dashboard/Dashboard.jsx"));
const NotFoundLazy = lazy(() => import("../page/error/NotFound.jsx"));
const LoginLazy = lazy(() => import("../page/login/Login.jsx"));
const router = createBrowserRouter([
    {
        path:"/",
        element: <ProtectRouter> <LayoutLazy /> </ProtectRouter> ,
        errorElement: <ErrorPageLazy />,
        children:[
            {
              path:"/",
              element: <DashboardLazy />,
            },
            {
                path:"/employees",
                children:[
                    {
                        path:"",
                        element: <EmployeesLazy />
                    },
                    {
                        path:"/employees/:id",
                        element: <EmployeeEditLazy/>
                    },
                    {
                        path:"/employees/add",
                        element: <EmployeeAddLazy/>
                    }
                ]
            },
            {
                path:"/products",
                element: <Products/>
            },
        ]
    },
    {
        path:"/login",
        element:<LoginLazy />,
    },
    {
        path:"*",
        element: <NotFoundLazy />
    }
]);

export default router;
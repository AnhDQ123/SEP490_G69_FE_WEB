import {RouterProvider} from "react-router-dom";
import router from "./router/router.jsx";
import {Suspense} from "react";
import Spin from "./ui/Spin.jsx";
import styled from "styled-components";
import {Toaster} from "react-hot-toast";

const SpinCenter = styled(Spin)`
    height:100vh;
    width:100vw;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size: 60px;
`
function App() {

    return (
        <>
            {/*<Suspense fallback={<SpinCenter/>}>*/}
            <RouterProvider router={router}>
            </RouterProvider>
            {/*</Suspense>*/}
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: "#363636",
                        color: "#fff",
                    },
                    // Tùy chỉnh riêng cho loại toast
                    success: {
                        style: {
                            background: "green",
                            color: "#fff",
                        },
                    },
                    error: {
                        style: {
                            background: "red",
                            color: "#fff",
                        },
                    },
                }}
            />
        </>
    )
}

export default App

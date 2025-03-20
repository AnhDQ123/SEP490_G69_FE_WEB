import React, { Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { CSpinner } from '@coreui/react';
import DefaultLayout from "./layout/DefaultLayout.jsx";
import Login from "./page/login/Login.jsx"; // Import trang login
import './scss/style.scss';

function App() {
    return (
        <HashRouter>
            <Suspense
                fallback={
                    <div className="pt-3 text-center">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                }
            >
                <Routes>
                    {/* Trang Login sẽ không có layout */}
                    <Route path="/login" element={<Login />} />
                    {/* Các trang khác sẽ dùng DefaultLayout */}
                    <Route path="*" element={<DefaultLayout />} />
                </Routes>
            </Suspense>
        </HashRouter>
    );
}

export default App;
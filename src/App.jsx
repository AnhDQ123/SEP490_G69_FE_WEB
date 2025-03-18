import React, {Suspense, useEffect} from 'react'
import {HashRouter, Route, Routes} from 'react-router-dom'

import {CSpinner, useColorModes} from '@coreui/react'
import DefaultLayout from "./layout/DefaultLayout.jsx";
import './scss/style.scss'
function App() {

    return (
        <HashRouter>
            <Suspense
                fallback={
                    <div className="pt-3 text-center">
                        <CSpinner color="primary" variant="grow"/>
                    </div>
                }
            >
                <Routes>
                    <Route path="*" name="Home" element={<DefaultLayout/>}/>
                </Routes>
            </Suspense>
        </HashRouter>
    );
}

export default App

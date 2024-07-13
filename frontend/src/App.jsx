// time spent coding: 7 hours 20 minutes

import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import HintPage from "./pages/HintPage.jsx";
import AllGames from "./pages/AllGames.jsx";
import NotFound from "./pages/404.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AllGames />}></Route>
                <Route path="/hint/:id" element={<HintPage />} />
                <Route path="*" element={<NotFound />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

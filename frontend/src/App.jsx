// time spent coding: 7 hours 20 minutes

import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import Hint from "./pages/Hint.jsx";
import AllGames from "./pages/AllGames.jsx";
import NotFound from "./pages/404.jsx";
import Game from "./pages/Game.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllGames />}></Route>
        <Route path="/game/:id" element={<Game />} />
        <Route path="/hint/:id" element={<Hint />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

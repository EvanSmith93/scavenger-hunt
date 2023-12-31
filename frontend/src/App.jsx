// time spent coding: 7 hours 20 minutes

import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import AddHint from './pages/AddHint.jsx';
import HintPage from './pages/HintPage.jsx';
import AllHints from './pages/AllHints.jsx';
import AllGames from './pages/AllGames.jsx';
import NotFound from './pages/404.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AddHint />}></Route>
          
          <Route path="all-hints" element={<AllHints />}></Route>
          <Route path="all-games" element={<AllGames />}></Route>
          <Route path="/hint/:id" element={<HintPage />}/>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
      
  );
}

export default App;

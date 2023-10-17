import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import BoardList from "./routes/BoardList";
import Home from "./routes/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/board" element={<BoardList />} />
    </Routes>
  );
}

export default App;

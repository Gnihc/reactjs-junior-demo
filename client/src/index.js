import { BrowserRouter, Route, Routes } from "react-router-dom"
import React from "react"
import ReactDOM from "react-dom/client"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import Image from "./pages/Image"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/image/*" element={<Image />}></Route>
        <Route path="*" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
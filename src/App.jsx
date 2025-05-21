import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from './pages/AuthLayout'
import NotFound from "./pages/NotFound.jsx";
import Home from "./pages/Home.jsx";
import NavLayout from "./pages/NavLayout.jsx";
import ContactUs from './pages/ContactUs.jsx'
import Profile from './pages/Profile.jsx'
import Service from './pages/Service.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}

        <Route path="/auth" elevation={<AuthLayout />}>
          <Route path="" element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="/" element={<NavLayout />}>
          <Route path="" element={<Home />} />
          <Route path="contact-us" element={<ContactUs/> } />
          <Route path="profile" element={<Profile/>}/>
          <Route path="/services" element={<Service/> } />
        </Route>


        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App

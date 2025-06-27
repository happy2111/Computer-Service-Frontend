import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About"
import { Helmet } from "react-helmet";
const Home = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Helmet>
        <title>Home</title>
      </Helmet>
      <main className="flex-1 flex items-center justify-center">
        <Hero />
      </main>
      <About/>
    </div>
  );
};

export default Home;

import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About"

const Home = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-1 flex items-center justify-center">
        <Hero />
      </main>
      <About/>
    </div>
  );
};

export default Home;

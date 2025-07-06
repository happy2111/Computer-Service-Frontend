import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About"
import { Helmet } from "react-helmet";
const Home = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Helmet>
        <title>Apple Park - iPhone, iPad, MacBook va boshqa Apple qurilmalarini ta'mirlash</title>
        <meta name="description" content="Apple Park - O'zbekistondagi eng yaxshi Apple qurilmalarini ta'mirlash markazi. iPhone, iPad, MacBook va boshqa Apple qurilmalarini professional ta'mirlash xizmatlari." />
        <meta name="keywords" content="Apple Park, iPhone ta'mirlash, iPad ta'mirlash, MacBook ta'mirlash, Apple Watch ta'mirlash, iCloud ochish, O'zbekiston" />

        {/* Canonical URL для главной страницы */}
        <link rel="canonical" href="https://www.applepark.uz/" />

        {/* Open Graph теги */}
        <meta property="og:title" content="Apple Park - iPhone, iPad, MacBook va boshqa Apple qurilmalarini ta'mirlash" />
        <meta property="og:description" content="Apple Park - O'zbekistondagi eng yaxshi Apple qurilmalarini ta'mirlash markazi. iPhone, iPad, MacBook va boshqa Apple qurilmalarini professional ta'mirlash xizmatlari." />
        <meta property="og:url" content="https://www.applepark.uz/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.applepark.uz/logo.PNG" />
        <meta property="og:site_name" content="Apple Park" />
        <meta property="og:locale" content="uz_UZ" />

        {/* Дополнительные мета-теги */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Apple Park" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <main className="flex-1 flex items-center justify-center">
        <Hero />
      </main>
      <About/>
    </div>
  );
};

export default Home;

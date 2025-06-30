"use client";

import Header from "@/components/home/header";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import Prices from "@/components/home/prices";
import Testimonials from "@/components/home/testimonials";
import Footer from "@/components/home/footer";

export default function Home() {
  return (
    <div className="bg-white">
      <Header />
      <Hero />
      <Features />
      <Prices />
      <Testimonials />
      <Footer />
    </div>
  );
}

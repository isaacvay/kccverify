"use client";

import React from 'react'
import Footer from './footer/Footer';
import How from './how/How';
import Presentation from './presentation/Presentation';
import Hero from './hero/Hero';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      < Hero/>
      <Presentation/>
       <How/>
      <Footer/>
    </div>
  )
}
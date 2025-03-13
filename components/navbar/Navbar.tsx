"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = {
  path: string;
  label: string;
  isCta?: boolean;
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks: NavLink[] = [
    { path: "/", label: "Accueil" },
    { path: "/pages/verification", label: "Vérification" },
    { path: "/pages/how-it-works", label: "Fonctionnement" },
    { path: "/pages/contact", label: "Contact" },
    { path: "/pages/login", label: "Connexion", isCta: true },
  ];

  const linkClasses = (path: string, isCta = false) => {
    const isActive = pathname === path;
    
    if (isCta) {
      return "px-5 py-2.5 rounded-full font-semibold bg-gradient-to-r from-[#01B4AC] to-[#018D86] text-white hover:shadow-lg transition-all hover:scale-[1.02]";
    }
    
    return `relative px-3 py-2 font-medium transition-colors ${
      isActive 
        ? "text-[#01B4AC] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#01B4AC]" 
        : "text-gray-700 hover:text-[#01B4AC] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-[#01B4AC]/20"
    }`;
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center hover:opacity-90 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          >
            <img
              src="/KCCLogo.svg"
              alt="Logo KCC"
              className="h-10 w-32 transition-transform hover:scale-105"
              width={128}
              height={40}
            />
          </Link>

          {/* Navigation Desktop */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(({ path, label, isCta }) => (
              <li key={path}>
                <Link
                  href={path}
                  className={`${linkClasses(path, isCta)} ${isCta ? 'shadow-md' : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Bouton Menu Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-xl hover:bg-[#01B4AC]/10 transition-colors"
            aria-label={`Menu ${isMenuOpen ? "fermé" : "ouvert"}`}
          >
            <div className="space-y-2">
              <span className={`block w-6 h-0.5 bg-[#01B4AC] transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-[#01B4AC] ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-[#01B4AC] transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Menu Mobile - Fond solide */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-40">
            <div className="h-screen flex flex-col items-center justify-center space-y-6 p-4">
              {navLinks.map(({ path, label, isCta }) => (
                <Link
                  key={path}
                  href={path}
                  className={`text-xl w-full text-center ${linkClasses(path, isCta)} ${isCta ? '!px-8 !py-4 mx-auto max-w-xs' : 'py-3'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-6 right-6 p-2 text-[#01B4AC] hover:text-[#018D86] transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
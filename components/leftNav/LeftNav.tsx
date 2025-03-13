"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  DocumentPlusIcon, 
  DocumentTextIcon, 
  UserCircleIcon, 
  ArrowLeftOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeftNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  
  const isActive = (path: string) => pathname.startsWith(path);
  const navWidth = isOpen ? 'w-64' : 'w-20';

  const links = [
    { href: "/dashboard", icon: <HomeIcon />, label: "Accueil" },
    { href: "/dashboard/profil", icon: <UserCircleIcon />, label: "Profil" },
    { href: "/dashboard/enregistrement", icon: <DocumentPlusIcon />, label: "Enregistrement" },
    { href: "/dashboard/bons", icon: <DocumentTextIcon />, label: "Bons" }
  ];

  return (
    <nav 
      className={`${navWidth} min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 fixed left-0 top-0 mt-20 transition-all duration-300 shadow-2xl group/nav`}
      onMouseLeave={() => setHoveredLink(null)}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <motion.div 
          className="mb-8 px-2 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {isOpen ? (
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              KCC
            </h1>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg" />
          )}
        </motion.div>

        {/* Liens principaux */}
        <div className="flex-1 space-y-2 relative">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              isActive={isActive(link.href)}
              isOpen={isOpen}
              onHover={setHoveredLink}
              isHovered={hoveredLink === link.href}
            />
          ))}

          {/* Tooltip pour mode réduit */}
          <AnimatePresence>
            {!isOpen && hoveredLink && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-800 rounded-lg shadow-lg text-sm text-white"
              >
                {hoveredLink}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bouton de déconnexion */}
        <motion.div 
          className="border-t border-gray-700/50 pt-4"
          layout
        >
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/20 rounded-lg transition-all group">
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm"
              >
                Déconnexion
              </motion.span>
            )}
          </button>
        </motion.div>

        {/* Bouton de réduction */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-1/2 bg-gray-800 p-1.5 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          aria-label={isOpen ? "Réduire le menu" : "Agrandir le menu"}
        >
          {isOpen ? (
            <ChevronDoubleLeftIcon className="h-5 w-5 text-white" />
          ) : (
            <ChevronDoubleRightIcon className="h-5 w-5 text-white" />
          )}
        </button>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isOpen: boolean;
  onHover: (label: string | null) => void;
  isHovered: boolean;
}

function NavLink({ href, icon, label, isActive, isOpen, onHover, isHovered }: NavLinkProps) {
  const baseClasses = "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all relative overflow-hidden";
  const inactiveClasses = "text-gray-300 hover:text-white";
  const activeClasses = "text-white bg-gradient-to-r from-blue-500/20 to-blue-600/10 border-l-2 border-blue-400";

  return (
    <Link
      href={href}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onMouseEnter={() => onHover(label)}
      onMouseLeave={() => onHover(null)}
      aria-current={isActive ? "page" : undefined}
    >
      <motion.span 
        className="h-6 w-6 shrink-0"
        whileHover={{ scale: 1.1 }}
      >
        {icon}
      </motion.span>

      {isOpen && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="opacity-100 group-hover/nav:opacity-100 transition-opacity"
        >
          {label}
        </motion.span>
      )}

      {/* Effet de survol */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </Link>
  );
}
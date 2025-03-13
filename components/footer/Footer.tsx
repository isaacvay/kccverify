import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#01B4AC] to-[#018D86] text-white pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo et description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">KCC RDC</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Leader dans la gestion transparente des ressources et la distribution sécurisée des fournitures essentielles.
            </p>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-2">Navigation</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="opacity-90 hover:opacity-100 transition-opacity">Accueil</Link></li>
              <li><Link href="/verification" className="opacity-90 hover:opacity-100 transition-opacity">Vérification</Link></li>
              <li><Link href="/contact" className="opacity-90 hover:opacity-100 transition-opacity">Contact</Link></li>
              <li><Link href="/faq" className="opacity-90 hover:opacity-100 transition-opacity">FAQ</Link></li>
            </ul>
          </div>

          {/* Coordonnées */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-2">Coordonnées</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="flex-shrink-0 mt-1" />
                <p>123 Av. des Ressources<br/>Lubumbashi, Katanga<br/>RDC</p>
              </div>
              <div className="flex items-center gap-3">
                <FaPhoneAlt />
                <a href="tel:+243999123456">+243 999 123 456</a>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope />
                <a href="mailto:info@kcc-rdc.com">info@kcc-rdc.com</a>
              </div>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-2">Suivez-nous</h4>
            <div className="flex gap-4 text-xl">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                <FaFacebook />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                <FaTwitter />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                <FaLinkedin />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Section infos légales */}
        <div className="border-t border-white/20 pt-8 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-center md:text-left">
              &copy; 2024 KCC RDC. Tous droits réservés.
            </div>
            <div className="flex gap-6">
              <Link href="/confidentialite" className="hover:underline">Confidentialité</Link>
              <Link href="/conditions" className="hover:underline">Conditions d'utilisation</Link>
              <Link href="/accessibilite" className="hover:underline">Accessibilité</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebase'; // Ajustez le chemin selon votre structure
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [error, setError] = useState<string>('');

  // Typage de l'événement pour un input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  // Typage de l'événement de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (!formData.terms) {
      setError("Vous devez accepter les conditions d'utilisation");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      // Mise à jour du profil de l'utilisateur avec son nom complet
      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });
      // Redirection vers /dashboard après une inscription réussie
      router.push('/dashboard');
    } catch (err: unknown) {
      // Vérifie que l'erreur est bien une instance d'Error pour accéder à "message"
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h1>
            <p className="text-gray-600">
              Déjà inscrit ?{' '}
              <Link href="/pages/login" className="text-[#01B4AC] hover:underline">
                Se connecter
              </Link>
            </p>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#01B4AC] focus:border-[#01B4AC] outline-none transition-all"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#01B4AC] focus:border-[#01B4AC] outline-none transition-all"
                  placeholder="jean.dupont@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#01B4AC] focus:border-[#01B4AC] outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#01B4AC] focus:border-[#01B4AC] outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
                className="h-4 w-4 text-[#01B4AC] focus:ring-[#01B4AC] border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                J'accepte les{' '}
                <Link href="/terms" className="text-[#01B4AC] hover:underline">
                  conditions d'utilisation
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#01B4AC] to-[#018D86] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

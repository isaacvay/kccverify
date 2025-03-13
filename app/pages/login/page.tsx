"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebase'; // Ajustez le chemin si nécessaire
import { signInWithEmailAndPassword } from 'firebase/auth';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push('/dashboard');
    } catch (err: unknown) {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Content de vous revoir</h1>
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/pages/inscription" className="text-[#01B4AC] hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#01B4AC] focus:border-[#01B4AC] outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#01B4AC] focus:border-[#01B4AC] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#01B4AC] focus:ring-[#01B4AC] border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                  Se souvenir de moi
                </label>
              </div>
              <Link href="/mot-de-passe-oublie" className="text-sm text-[#01B4AC] hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#01B4AC] to-[#018D86] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

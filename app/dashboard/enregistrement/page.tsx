"use client";

import { CheckCircleIcon, CloudArrowDownIcon, XCircleIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FormData {
  nom: string;
  matricule: string;
  gsp: string;
  mois: string;
  pointDistribution: string;
  photo: File | null;
}

export default function EnregistrementPage() {
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    matricule: "",
    gsp: "",
    mois: "",
    pointDistribution: "",
    photo: null,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file?.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setErrors((prev) => ({ ...prev, photo: "" }));
    }
  }, []);

  const onDropRejected = useCallback(() => {
    setErrors((prev) => ({
      ...prev,
      photo: "Image trop volumineuse (max 2 Mo)",
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { "image/*": [] },
    maxSize: 2 * 1024 * 1024,
    multiple: false,
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nom.match(/^[A-Za-z\s]{3,}$/)) {
      newErrors.nom = "Nom invalide (min 3 lettres)";
    }
    if (!formData.matricule.match(/^[A-Z0-9]{6,10}$/)) {
      newErrors.matricule = "Matricule invalide (6-10 caractères alphanumériques)";
    }
    if (!formData.photo) newErrors.photo = "Photo requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction d'upload de l'image vers Cloudinary
  const uploadImage = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      throw new Error("Configuration Cloudinary manquante");
    }
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', uploadPreset);

    const res = await fetch(url, {
      method: 'POST',
      body: data,
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error.message);
    }
    return json.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let photoUrl = "";
      if (formData.photo) {
        photoUrl = await uploadImage(formData.photo);
      }
      // Simulation d'appel API ou sauvegarde des données avec l'URL de la photo
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Données soumises:", { ...formData, photo: photoUrl });
      alert("Enregistrement réussi !");
      setFormData({
        nom: "",
        matricule: "",
        gsp: "",
        mois: "",
        pointDistribution: "",
        photo: null,
      });
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-[#01B4AC]/20 overflow-hidden">
        <div className="bg-[#01B4AC] p-6">
          <h1 className="text-3xl font-bold text-white text-center">
            Enregistrement
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Zone de dépôt de fichier */}
          <div
            {...getRootProps()}
            className={`flex flex-col items-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              isDragActive
                ? "border-[#01B4AC] bg-[#01B4AC]/10"
                : "border-gray-300 hover:border-[#01B4AC]/50"
            }`}
          >
            <input {...getInputProps()} />
            {formData.photo ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(formData.photo)}
                  alt="Profil"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-2"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <CloudArrowDownIcon className="h-10 w-10 text-[#01B4AC] mb-2" />
                <p className="text-gray-600 text-center">
                  {isDragActive
                    ? "Relâchez pour déposer"
                    : "Glissez-déposez une photo ou cliquez pour sélectionner"}
                </p>
              </>
            )}
            {errors.photo && (
              <p className="text-red-500 text-sm mt-2">{errors.photo}</p>
            )}
          </div>

          {/* Champs du formulaire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Nom complet"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              error={errors.nom}
              placeholder="Jean Dupont"
            />
            <InputField
              label="Matricule"
              name="matricule"
              value={formData.matricule}
              onChange={handleChange}
              error={errors.matricule}
              placeholder="ABC123"
            />
            <SelectField
              label="GSP"
              name="gsp"
              value={formData.gsp}
              onChange={handleChange}
              options={["GSP Nord", "GSP Sud", "GSP Est", "GSP Ouest"]}
            />
            <InputField
              type="month"
              label="Mois"
              name="mois"
              value={formData.mois}
              onChange={handleChange}
            />
            <SelectField
              label="Point de distribution"
              name="pointDistribution"
              value={formData.pointDistribution}
              onChange={handleChange}
              options={["Point A", "Point B", "Point C", "Point D"]}
              className="md:col-span-2"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 text-lg font-semibold text-white rounded-xl transition-all ${
              isSubmitting
                ? "bg-[#01B4AC]/70 cursor-wait"
                : "bg-[#01B4AC] hover:bg-[#018D86]"
            } flex items-center justify-center gap-3`}
          >
            {isSubmitting ? (
              <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
            ) : (
              <CheckCircleIcon className="h-6 w-6" />
            )}
            <span>
              {isSubmitting ? "Enregistrement..." : "Confirmer l'enregistrement"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

// Composants réutilisables
interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}

const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: InputFieldProps) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 transition-all ${
        error
          ? "border-red-500 focus:ring-red-200"
          : "border-gray-300 focus:border-[#01B4AC] focus:ring-[#01B4AC]/20"
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  className?: string;
}

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  className,
}: SelectFieldProps) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:border-[#01B4AC] focus:ring-[#01B4AC]/20 transition-all"
    >
      <option value="">Sélectionner...</option>
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

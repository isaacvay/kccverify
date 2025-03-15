"use client";
import React, { useState, useRef, useEffect } from 'react';
import { CameraIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '@/firebase/firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';

export default function ProfilePage() {
  const [user, setUser] = useState({
    avatar: 'https://i.pravatar.cc/150',
    name: '',
    email: '',
    role: '',
    bio: ''
  });
  
  const [tempUser, setTempUser] = useState(user);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("Vous devez être connecté");
          setLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          setError("Profil utilisateur introuvable");
          setLoading(false);
          return;
        }

        const userData = userDoc.data();
        setUser({
          avatar: userData.avatar || 'https://i.pravatar.cc/150',
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'Utilisateur',
          bio: userData.bio || ''
        });
        setTempUser({
          avatar: userData.avatar || 'https://i.pravatar.cc/150',
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'Utilisateur',
          bio: userData.bio || ''
        });
      } catch (err) {
        setError("Erreur lors du chargement du profil");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setTempUser(user);
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateDoc(doc(db, 'users', user.uid), {
        ...tempUser,
        updatedAt: new Date()
      });

      setUser(tempUser);
      setEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError("Erreur lors de la mise à jour");
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setTempUser(prev => ({ ...prev, avatar: url }));
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xl space-y-8 relative border border-[#01B4AC]/20"
      >
        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#01B4AC] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm"
            >
              <CheckIcon className="w-5 h-5" />
              <span>Profil mis à jour !</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <img
              src={editing ? tempUser.avatar : user.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {editing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <CameraIcon className="w-8 h-8 text-white" />
              </motion.div>
            )}
          </div>
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        {/* Profile Form */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">Profil Utilisateur</h2>
          
          <div className="grid gap-4">
            <ProfileField 
              label="Nom complet"
              value={editing ? tempUser.name : user.name}
              editing={editing}
              onChange={(e: { target: { value: any; }; }) => setTempUser(prev => ({ ...prev, name: e.target.value }))}
              icon={<PencilIcon className="w-5 h-5" />}
            />
            
            <ProfileField 
              label="Adresse email"
              value={editing ? tempUser.email : user.email}
              editing={editing}
              onChange={(e: { target: { value: any; }; }) => setTempUser(prev => ({ ...prev, email: e.target.value }))}
              type="email"
              icon={<PencilIcon className="w-5 h-5" />}
            />
            
            <ProfileField 
              label="Rôle"
              value={editing ? tempUser.role : user.role}
              editing={editing}
              onChange={(e: { target: { value: any; }; }) => setTempUser(prev => ({ ...prev, role: e.target.value }))}
              icon={<PencilIcon className="w-5 h-5" />}
            />
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-2">Bio</label>
              <textarea
                value={editing ? tempUser.bio : user.bio}
                onChange={(e) => setTempUser(prev => ({ ...prev, bio: e.target.value }))}
                className={`w-full p-3 rounded-xl border ${
                  editing 
                    ? 'border-[#01B4AC] focus:ring-2 focus:ring-[#01B4AC]/20' 
                    : 'border-gray-200 bg-gray-50'
                } transition-all`}
                rows={4}
                disabled={!editing}
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                {editing ? tempUser.bio.length : user.bio.length}/500
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div className="flex justify-end gap-3">
          {!editing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="bg-[#01B4AC] text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-[#018D86] transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
              Modifier le profil
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-300 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
                Annuler
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="bg-[#018D86] text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-[#017a74] transition-colors"
              >
                <CheckIcon className="w-5 h-5" />
                Sauvegarder
              </motion.button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

function ProfileField({ label, value, editing, onChange, type = 'text', icon }: any) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full p-3 rounded-xl border ${
            editing 
              ? 'border-[#01B4AC] focus:ring-2 focus:ring-[#01B4AC]/20' 
              : 'border-gray-200 bg-gray-50'
          } transition-all pr-12`}
          disabled={!editing}
        />
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${editing ? 'text-[#01B4AC]' : 'text-gray-300'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

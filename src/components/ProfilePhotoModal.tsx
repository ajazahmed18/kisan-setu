import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Upload,
  Camera,
  Check,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  Link2,
} from 'lucide-react';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoURL?: string | null;
  userName?: string;
}

// Curated SVG / Data / Unsplash Agricultural Profile Avatars
export const AGRI_AVATAR_PRESETS = [
  {
    id: 'farmer-traditional',
    label: 'Traditional Farmer',
    roleTag: 'Farmer',
    url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'farmer-modern',
    label: 'Modern Agripreneur',
    roleTag: 'Farmer',
    url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'farmer-woman',
    label: 'Woman Farmer Leader',
    roleTag: 'Farmer',
    url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'fpo-director',
    label: 'FPO Executive Director',
    roleTag: 'FPO Co-Op',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'agri-scientist',
    label: 'Agri Scientist / Officer',
    roleTag: 'Scientist',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'verified-buyer',
    label: 'Wholesale Mill Buyer',
    roleTag: 'Buyer',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'transporter-fleet',
    label: 'Agri Freight Logistics',
    roleTag: 'Transporter',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  },
];

export const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({
  isOpen,
  onClose,
  currentPhotoURL,
  userName = 'Farmer Partner',
}) => {
  const { uploadProfilePicture, updateProfilePhotoURL, removeProfilePicture, userProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(currentPhotoURL || null);
  const [customURLInput, setCustomURLInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewURL(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (url: string) => {
    setSelectedFile(null);
    setPreviewURL(url);
    setErrorMessage(null);
  };

  const handleApplyCustomURL = () => {
    const trimmed = customURLInput.trim();
    if (!trimmed) {
      setErrorMessage('Please enter an image URL.');
      return;
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setErrorMessage('Please enter a valid URL starting with https://');
      return;
    }
    setSelectedFile(null);
    setPreviewURL(trimmed);
    setErrorMessage(null);
  };

  const handleSavePhoto = async () => {
    if (!previewURL && !selectedFile) {
      setErrorMessage('Please select or upload an image first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (selectedFile) {
        // Upload file (uses Firebase Storage or Base64 data URL fallback)
        await uploadProfilePicture(selectedFile);
      } else if (previewURL) {
        // Update direct preset or image URL
        await updateProfilePhotoURL(previewURL);
      }

      setSuccessMessage('Profile photo updated successfully!');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Error updating photo:', err);
      setErrorMessage(err.message || 'Failed to update profile photo. Please try another image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove your profile photo?')) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await removeProfilePicture();
      setPreviewURL(null);
      setSelectedFile(null);
      setSuccessMessage('Profile photo removed.');
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to remove photo.');
    } finally {
      setIsLoading(false);
    }
  };

  const effectivePhoto = previewURL || currentPhotoURL || userProfile?.photoURL;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Update Profile Photo</h3>
              <p className="text-xs text-slate-500">Upload device picture, select an agri avatar, or provide a web link</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Avatar Live Preview */}
          <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="w-20 h-20 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl overflow-hidden shadow-sm shrink-0 border-2 border-white">
              {effectivePhoto ? (
                <img
                  src={effectivePhoto}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{userName.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                Live Preview
              </span>
              <p className="font-bold text-sm text-slate-800 truncate">{userName}</p>
              <p className="text-xs text-slate-500">
                {effectivePhoto ? 'Custom photo chosen' : 'Using default initials avatar'}
              </p>
            </div>

            {effectivePhoto && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isLoading}
                title="Remove current photo"
                className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Feedback alerts */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Method Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Agri Avatars</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Image URL</span>
            </button>
          </div>

          {/* TAB 1: UPLOAD FILE */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drag &amp; drop your photo
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports JPG, PNG, WebP up to 5MB
                  </p>
                </div>
                {selectedFile && (
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-full mt-2">
                    Selected: {selectedFile.name}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AGRI AVATAR PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500">
                Choose a verified agricultural archetype avatar:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
                {AGRI_AVATAR_PRESETS.map((avatar) => {
                  const isSelected = previewURL === avatar.url;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => handlePresetSelect(avatar.url)}
                      className={`p-2 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col items-center text-center ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={avatar.url}
                        alt={avatar.label}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover mb-1.5 shadow-2xs border border-slate-100"
                      />
                      <span className="text-[11px] font-bold text-slate-800 line-clamp-1">
                        {avatar.label}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {avatar.roleTag}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM IMAGE URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Online Image Web URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customURLInput}
                    onChange={(e) => setCustomURLInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomURL}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                  >
                    Preview
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Paste any public image address (Unsplash, imgur, or your farm website).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSavePhoto}
            disabled={isLoading || (!selectedFile && !previewURL)}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Photo...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Profile Photo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

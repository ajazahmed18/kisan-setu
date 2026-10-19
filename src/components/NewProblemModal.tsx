import React, { useState } from 'react';
import { CommunityPost, ProblemCategory, ProblemUrgency, UserProfile } from '../types';
import {
  X,
  AlertTriangle,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  Phone,
  Sparkles,
  HelpCircle,
  Wheat,
  Tag,
} from 'lucide-react';

interface NewProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Partial<CommunityPost>) => void;
  currentUser?: UserProfile | null;
}

const QUICK_PHOTO_PRESETS = [
  {
    label: 'Whitefly on Cotton',
    url: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=800&auto=format&fit=crop&q=80',
    crop: 'Cotton',
    category: 'pest_disease' as ProblemCategory,
  },
  {
    label: 'Waterlogged Paddy',
    url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&auto=format&fit=crop&q=80',
    crop: 'Rice (Paddy)',
    category: 'weather_damage' as ProblemCategory,
  },
  {
    label: 'Chilli Black Thrips',
    url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80',
    crop: 'Red Chilli',
    category: 'pest_disease' as ProblemCategory,
  },
  {
    label: 'Tomato Leaf Blight',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?w=800&auto=format&fit=crop&q=80',
    crop: 'Tomato',
    category: 'crop_health' as ProblemCategory,
  },
];

export const NewProblemModal: React.FC<NewProblemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
}) => {
  const [title, setTitle] = useState('');
  const [crop, setCrop] = useState('Cotton');
  const [category, setCategory] = useState<ProblemCategory>('pest_disease');
  const [urgency, setUrgency] = useState<ProblemUrgency>('urgent');
  const [question, setQuestion] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [includePhone, setIncludePhone] = useState(true);
  const [farmerLocation, setFarmerLocation] = useState(currentUser?.location || 'Warangal District, Telangana');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !question.trim()) return;

    setIsSubmitting(true);

    try {
      onSubmit({
        farmerId: currentUser?.id,
        farmerName: currentUser?.name || 'Verified Farmer',
        farmerRole: currentUser?.role || 'farmer',
        farmerAvatar: currentUser?.avatar,
        farmerLocation: farmerLocation || 'Telangana',
        farmerPhone: includePhone ? (currentUser?.phone || '+91 98480 23456') : undefined,
        crop,
        problemCategory: category,
        urgency,
        title: title.trim(),
        question: question.trim(),
        imageUrl: imageUrl || undefined,
        status: 'open',
        likes: [],
        replies: [],
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 text-left">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Report Crop Problem / Ask Community Query
              </h3>
              <p className="text-xs text-slate-500">
                Visible to all farmers, agricultural officers, and FPO agronomists across the platform.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto space-y-4 flex-1">
          {/* Urgency Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUrgency('urgent')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  urgency === 'urgent'
                    ? 'bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>🚨 Urgent (Crop at Risk)</span>
              </button>
              <button
                type="button"
                onClick={() => setUrgency('moderate')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  urgency === 'moderate'
                    ? 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>⚠️ Moderate (2-3 Days)</span>
              </button>
              <button
                type="button"
                onClick={() => setUrgency('inquiry')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  urgency === 'inquiry'
                    ? 'bg-blue-50 text-blue-800 border-blue-300 ring-2 ring-blue-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>ℹ️ General Inquiry</span>
              </button>
            </div>
          </div>

          {/* Problem Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Problem Title / Headline <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Severe whitefly attack and yellow leaf curling on BT-Cotton at flowering stage"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Crop & Category Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Affected Crop <span className="text-rose-500">*</span>
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Cotton">Cotton (BT-II)</option>
                <option value="Rice (Paddy)">Rice / Paddy (Samba Masuri / Sona)</option>
                <option value="Red Chilli">Red Chilli (Teja / Guntur)</option>
                <option value="Tomato">Tomato (Hybrid)</option>
                <option value="Maize">Maize (Yellow Corn)</option>
                <option value="Soybean">Soybean</option>
                <option value="Turmeric">Turmeric</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Onion">Onion</option>
                <option value="Wheat">Wheat</option>
                <option value="Vegetables">Other Vegetables</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Problem Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProblemCategory)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="pest_disease">Pest & Insect Attack</option>
                <option value="crop_health">Disease, Fungus & Nutrient Deficiency</option>
                <option value="weather_damage">Weather, Flood & Waterlogging</option>
                <option value="market_mandi">Mandi Rates & Selling Advice</option>
                <option value="seeds_fertilizer">Seeds, Sowing & Fertilizer</option>
                <option value="machinery">Machinery, Tractor & Irrigation</option>
                <option value="government_scheme">PM-Kisan & Government Subsidies</option>
                <option value="general">General Agronomy</option>
              </select>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Detailed Symptoms & Observations <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Describe in detail: What symptoms did you observe on leaves/flowers/roots? How many acres are affected? When did it start? What sprays or fertilizers have you already tried?"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>

          {/* Photo Attachment & Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Attach Crop Photo / Symptom Image (Optional)
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL or choose a preset/file below..."
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                />
                <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Quick Sample Presets */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-slate-500 font-medium">Quick Presets:</span>
                {QUICK_PHOTO_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      setCrop(preset.crop);
                      setCategory(preset.category);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Preview Thumbnail */}
              {imageUrl && (
                <div className="relative mt-2 w-32 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Location & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Farmer Village / Location
              </label>
              <input
                type="text"
                value={farmerLocation}
                onChange={(e) => setFarmerLocation(e.target.value)}
                placeholder="e.g. Warangal Rural, Telangana"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Direct Phone Contact</span>
                <span className="text-[11px] text-slate-500">Allow farmers/experts to call with quick solutions</span>
              </div>
              <input
                type="checkbox"
                checked={includePhone}
                onChange={(e) => setIncludePhone(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Posting...' : 'Post Problem to Community'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

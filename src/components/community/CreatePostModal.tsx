import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { KisanPost } from '../../types/community';
import {
  X,
  Globe,
  Lock,
  Image as ImageIcon,
  UploadCloud,
  Send,
  Trash2,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: Partial<KisanPost>) => void;
  currentUserId: string;
  currentUserName: string;
  currentUserDistrict?: string;
  currentUserState?: string;
  currentUserAvatar?: string;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUserId,
  currentUserName,
  currentUserDistrict = 'Warangal',
  currentUserState = 'Telangana',
  currentUserAvatar,
}) => {
  const { language } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    setIsSubmitting(true);

    const postData: Partial<KisanPost> = {
      title: title.trim() || 'Farming Update',
      content: content.trim(),
      visibility,
      postType: 'field_update',
      crop: 'General Agriculture',
      mediaUrls: photoPreview ? [photoPreview] : [],
      location: `${currentUserDistrict}, ${currentUserState}`,
      createdAt: 'Just now',
    };

    setTimeout(() => {
      onSubmit(postData);
      setIsSubmitting(false);
      // Reset form
      setTitle('');
      setContent('');
      setVisibility('public');
      setPhotoPreview(null);
      onClose();
    }, 250);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div className="px-6 py-4.5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                {currentUserAvatar ? (
                  <img
                    src={currentUserAvatar}
                    alt={currentUserName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="font-bold text-sm text-white">
                    {currentUserName.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-base text-white leading-tight">
                  {language === 'te' ? 'పోస్ట్ చేయండి' : language === 'hi' ? 'पोस्ट बनाएं' : 'Create Post'}
                </h3>
                <p className="text-xs text-emerald-100/90 flex items-center gap-1 mt-0.5">
                  <span>{language === 'te' ? 'రైతుగా పోస్ట్' : language === 'hi' ? 'पोस्ट कर रहे हैं' : 'Posting as'} {currentUserName}</span>
                  <span>•</span>
                  <MapPin className="w-3 h-3 inline" />
                  <span>{currentUserDistrict}</span>
                </p>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Post Title */}
            <div>
              <label htmlFor="post-title-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {language === 'te' ? 'పోస్ట్ శీర్షిక' : language === 'hi' ? 'पोस्ट शीर्षक' : 'Post Title'}
              </label>
              <input
                id="post-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  language === 'te'
                    ? 'మీ పోస్ట్‌కు శీర్షిక ఇవ్వండి (ఉదా: డ్రిప్ సాగు ద్వారా మంచి దిగుబడి)...'
                    : language === 'hi'
                    ? 'पोस्ट को शीर्षक दें (उदा. ड्रिप सिंचाई से शानदार पैदावार)...'
                    : 'Give your post a title (e.g. Good harvest yield from drip irrigation)...'
                }
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="post-content-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {language === 'te' ? 'వివరణ' : language === 'hi' ? 'विवरण' : 'Description'}
              </label>
              <textarea
                id="post-content-input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder={
                  language === 'te'
                    ? 'మీ పొలంలో ఏం జరుగుతోంది? పంట వివరాలు లేదా సలహాలు ఇక్కడ రాయండి...'
                    : language === 'hi'
                    ? 'खेत में क्या चल रहा है? फसल की स्थिति या सलाह यहां लिखें...'
                    : "What's happening in your field? Describe your crop status, updates, farming advice, or questions..."
                }
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Public or Private Post Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                {language === 'te' ? 'పోస్ట్ దృశ్యమానత' : language === 'hi' ? 'दृश्यता' : 'Visibility'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Public Option */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setVisibility('public')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    visibility === 'public'
                      ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600/20 text-emerald-950'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      visibility === 'public'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm">
                        {language === 'te' ? 'ప్రజా పోస్ట్' : language === 'hi' ? 'सार्वजनिक' : 'Public Post'}
                      </span>
                      {visibility === 'public' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {language === 'te'
                        ? 'కమ్యూనిటీలోని రైతులందరికీ కనిపిస్తుంది'
                        : language === 'hi'
                        ? 'समुदाय के सभी किसानों को दिखेगा'
                        : 'Visible to all farmers in community'}
                    </p>
                  </div>
                </motion.button>

                {/* Private Option */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setVisibility('private')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    visibility === 'private'
                      ? 'bg-slate-100 border-slate-700 ring-2 ring-slate-700/20 text-slate-900'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      visibility === 'private'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm">
                        {language === 'te' ? 'వ్యక్తిగత పోస్ట్' : language === 'hi' ? 'निजी पोस्ट' : 'Private Post'}
                      </span>
                      {visibility === 'private' && (
                        <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {language === 'te'
                        ? 'మీ వ్యక్తిగత నోట్స్‌లో మాత్రమే భద్రపరచబడుతుంది'
                        : language === 'hi'
                        ? 'केवल आपके निजी नोट्स में सुरक्षित रहेगा'
                        : 'Only saved to your personal farm notes'}
                    </p>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Photo Upload (Neat & Simple) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {language === 'te' ? 'ఫోటో జోడించండి' : language === 'hi' ? 'फोटो जोड़ें' : 'Add Photo'}{' '}
                <span className="text-slate-400 font-normal normal-case">
                  ({language === 'te' ? 'ఐచ్ఛికం' : language === 'hi' ? 'वैकल्पिक' : 'Optional'})
                </span>
              </label>

              {photoPreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
                  <img
                    src={photoPreview}
                    alt="Post preview"
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{language === 'te' ? 'ఫోటో తొలగించు' : language === 'hi' ? 'फोटो हटाएं' : 'Remove Photo'}</span>
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4.5 text-center cursor-pointer transition-all ${
                    dragOver
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50/80'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {language === 'te'
                      ? 'ఫోటో అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి'
                      : language === 'hi'
                      ? 'फोटो अपलोड करने के लिए क्लिक करें'
                      : 'Click to attach photo or drag and drop'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    JPG, PNG, WEBP
                  </p>
                </div>
              )}
            </div>

            {/* Actions: Cancel & Share Post */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4.5 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              >
                {language === 'te' ? 'రద్దు' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                type="submit"
                disabled={isSubmitting || (!title.trim() && !content.trim())}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? (language === 'te' ? 'పోస్ట్ అవుతోంది...' : language === 'hi' ? 'साझा हो रहा है...' : 'Sharing...')
                    : (language === 'te' ? 'పోస్ట్ చేయండి' : language === 'hi' ? 'पोस्ट साझा करें' : 'Share Post')}
                </span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

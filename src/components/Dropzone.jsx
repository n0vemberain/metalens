import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Camera, MapPin, Sparkles, AlertCircle, FileCheck } from 'lucide-react';

export default function Dropzone({ onFileSelected, isLoading, t }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Handle clipboard paste (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            onFileSelected(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFileSelected]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };

  // Sample image loader
  const loadSample = async (samplePath, sampleName) => {
    try {
      const response = await fetch(samplePath);
      const blob = await response.blob();
      const file = new File([blob], sampleName, { type: 'image/jpeg' });
      onFileSelected(file);
    } catch (err) {
      console.error('Failed to load sample image:', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>ফটোগ্রাফার ও ডিজাইনারদের জন্য প্রফেশনাল মেটাডেটা টুল</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
          যেকোনো ছবির <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">গোপন মেটাডেটা ও EXIF</span> বের করুন
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          ক্যামেরা সেটিংস, লেন্স, শাটার স্পিড, আইএসও, জিপিএস লোকেশন ও ক্রিয়েটর কপিরাইট তথ্যসহ শত শত বিস্তারিত ট্যাগ এক ক্লিকে বিশ্লেষণ করুন।
        </p>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-14 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-950/40 shadow-2xl shadow-indigo-500/20 scale-[1.01]'
            : 'border-slate-700/80 bg-slate-800/40 hover:border-indigo-500/60 hover:bg-slate-800/60 shadow-xl'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.jpg,.jpeg,.png,.webp,.tiff,.tif,.heic,.avif,.cr2,.nef,.arw,.dng"
          onChange={handleInputChange}
          className="hidden"
        />

        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-base font-semibold text-indigo-300">মেটাডেটা বিশ্লেষণ করা হচ্ছে...</p>
            <p className="text-xs text-slate-400">EXIF, XMP, IPTC ও GPS ট্যাগ এক্সট্রাক্ট হচ্ছে</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Animated Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <UploadCloud className="w-10 h-10 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            </div>

            <div>
              <p className="text-lg sm:text-xl font-bold text-white mb-1">
                {t.dropzoneTitle}
              </p>
              <p className="text-sm text-indigo-300 font-medium">
                {t.dropzoneSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-700/50 border border-slate-600/50">JPEG / JPG</span>
              <span className="px-2 py-0.5 rounded bg-slate-700/50 border border-slate-600/50">PNG</span>
              <span className="px-2 py-0.5 rounded bg-slate-700/50 border border-slate-600/50">WEBP</span>
              <span className="px-2 py-0.5 rounded bg-slate-700/50 border border-slate-600/50">HEIC / AVIF</span>
              <span className="px-2 py-0.5 rounded bg-slate-700/50 border border-slate-600/50">RAW (CR2/NEF/ARW)</span>
            </div>

            <div className="pt-2 text-xs text-slate-400 flex items-center space-x-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{t.pasteTip}</span>
            </div>
          </div>
        )}
      </div>

      {/* Pre-loaded Sample Selector */}
      <div className="mt-8 pt-6 border-t border-slate-800/80">
        <p className="text-xs sm:text-sm font-semibold text-slate-300 text-center mb-4 flex items-center justify-center space-x-2">
          <span>{t.sampleTitle}</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => loadSample('/samples/sony_a7iv_dhaka.jpg', 'sony_a7iv_dhaka.jpg')}
            className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 transition text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white group-hover:text-indigo-300 transition">
                {t.sampleSony}
              </p>
              <p className="text-[11px] text-slate-400">Sony A7 IV • 50mm f/1.4</p>
            </div>
          </button>

          <button
            onClick={() => loadSample('/samples/iphone15_coxsbazar.jpg', 'iphone15_coxsbazar.jpg')}
            className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 transition text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white group-hover:text-emerald-300 transition">
                {t.sampleIphone}
              </p>
              <p className="text-[11px] text-slate-400">iPhone 15 Pro • GPS সৈকত</p>
            </div>
          </button>

          <button
            onClick={() => loadSample('/samples/canon_r5_sajek.jpg', 'canon_r5_sajek.jpg')}
            className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 transition text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white group-hover:text-amber-300 transition">
                {t.sampleCanon}
              </p>
              <p className="text-[11px] text-slate-400">Canon EOS R5 • RF 24-70</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

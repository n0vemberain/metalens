import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Camera, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  Layers, 
  FileCode2, 
  Eye, 
  ArrowRight,
  Smartphone,
  Download
} from 'lucide-react';

export default function Dropzone({ onFileSelected, isLoading }) {
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
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-14">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Professional EXIF, IPTC & GPS Geolocation Studio</span>
          </div>
          <a
            href="https://github.com/n0vemberain/metalens/releases/download/v1.0.0/MetaLens.apk"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition active:scale-95 shadow-sm"
            title="Download MetaLens APK for Android"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Android APK v1.0.0 Available</span>
            <Download className="w-3 h-3 text-emerald-400" />
          </a>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 leading-tight">
          Inspect & Extract Image <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Metadata Instantly
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Analyze camera hardware, aperture, shutter speed, ISO, lens profiles, GPS coordinates, and raw EXIF/IPTC tags directly in your browser with zero server uploads.
        </p>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-3xl border-2 border-dashed p-8 sm:p-14 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-950/40 shadow-2xl shadow-indigo-500/20 scale-[1.01]'
            : 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/60 hover:bg-slate-900/80 shadow-2xl'
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
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-base font-semibold text-indigo-300">Extracting image metadata...</p>
            <p className="text-xs text-slate-400">Parsing EXIF, XMP, IPTC, and GPS data chunks</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <UploadCloud className="w-10 h-10 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            </div>

            <div>
              <p className="text-xl sm:text-2xl font-bold text-white mb-1">
                Drag and drop your image here
              </p>
              <p className="text-sm text-indigo-300 font-medium">
                or click to browse files from your computer
              </p>
            </div>

            {/* Supported Formats */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-xs text-slate-400 max-w-xl">
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono text-[11px]">JPEG</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono text-[11px]">PNG</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono text-[11px]">WEBP</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono text-[11px]">HEIC</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono text-[11px]">TIFF</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono text-[11px]">AVIF</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono text-[11px]">RAW (CR2, NEF, ARW, DNG)</span>
            </div>

            {/* Paste from Clipboard tip */}
            <div className="pt-2 text-xs text-slate-400 flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Pro-tip: You can paste any image directly from your clipboard using Ctrl+V or Cmd+V</span>
            </div>
          </div>
        )}
      </div>

      {/* Pre-loaded Sample Selector */}
      <div className="mt-12 pt-8 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Instant Camera Samples</h2>
            <p className="text-xs text-slate-400">Click any pre-configured photograph to test EXIF parsing and GPS mapping immediately:</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Sony Sample */}
          <button
            onClick={() => loadSample('/samples/sony_a7iv_dhaka.jpg', 'sony_a7iv_dhaka.jpg')}
            className="flex items-center space-x-3.5 p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 transition-all text-left group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition flex-shrink-0">
              <Camera className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition truncate">
                  Sony Alpha A7 IV
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">Hatirjheel, Dhaka</p>
              <p className="text-[10px] text-indigo-400/90 font-mono mt-0.5">50mm f/1.4 GM • GPS Tagged</p>
            </div>
          </button>

          {/* iPhone Sample */}
          <button
            onClick={() => loadSample('/samples/iphone15_coxsbazar.jpg', 'iphone15_coxsbazar.jpg')}
            className="flex items-center space-x-3.5 p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 transition-all text-left group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition truncate">
                  Apple iPhone 15 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">Cox's Bazar Beach</p>
              <p className="text-[10px] text-emerald-400/90 font-mono mt-0.5">24mm f/1.78 • GPS Sea Level</p>
            </div>
          </button>

          {/* Canon Sample */}
          <button
            onClick={() => loadSample('/samples/canon_r5_sajek.jpg', 'canon_r5_sajek.jpg')}
            className="flex items-center space-x-3.5 p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 transition-all text-left group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition flex-shrink-0">
              <Camera className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition truncate">
                  Canon EOS R5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">Sajek Valley Sunrise</p>
              <p className="text-[10px] text-amber-400/90 font-mono mt-0.5">RF 24-70mm f/2.8 • 580m Alt</p>
            </div>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">100% Client-Side</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your images are never sent over the network. All EXIF parsing runs strictly in your local browser memory.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Exposure Triangle</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instant extraction of aperture, shutter speed, ISO sensitivity, 35mm equivalent focal length, and metering mode.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">GPS Geolocation Map</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Interactive OpenStreetMap display with decimal degrees, DMS formatting, and elevation altitude stats.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Privacy Sanitizer</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Purge sensitive geolocation, camera serial numbers, and EXIF tags before sharing photos online.
          </p>
        </div>
      </div>
    </div>
  );
}

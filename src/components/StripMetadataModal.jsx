import React, { useState } from 'react';
import { ShieldCheck, Download, X, Sliders, CheckCircle2 } from 'lucide-react';
import { stripMetadata, downloadBlob } from '../utils/metadataParser';

export default function StripMetadataModal({ isOpen, onClose, file, t }) {
  const [format, setFormat] = useState('image/jpeg');
  const [quality, setQuality] = useState(0.92);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!file) return;
    setIsProcessing(true);
    setDownloadDone(false);

    try {
      const cleanBlob = await stripMetadata(file, format, quality);
      const ext = format === 'image/png' ? 'png' : 'jpg';
      const cleanFileName = `clean_${file.name.replace(/\.[^/.]+$/, "")}.${ext}`;
      downloadBlob(cleanBlob, cleanFileName);
      setDownloadDone(true);
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    } catch (err) {
      console.error('Error stripping metadata:', err);
      setIsProcessing(false);
      alert('ছবি প্রসেসিং করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700/80 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.cleanDownloadModalTitle}</h3>
            <p className="text-xs text-slate-400">ব্যক্তিগত তথ্য ও ভৌগোলিক স্থানাঙ্ক সুরক্ষিত রাখুন</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          {t.cleanDownloadDesc}
        </p>

        {/* Options */}
        <div className="space-y-4 mb-6">
          {/* Format Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              আউটপুট ফরম্যাট:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('image/jpeg')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  format === 'image/jpeg'
                    ? 'border-indigo-500 bg-indigo-500/20 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                JPEG / JPG (কম্প্যাক্ট সাইজ)
              </button>
              <button
                type="button"
                onClick={() => setFormat('image/png')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  format === 'image/png'
                    ? 'border-indigo-500 bg-indigo-500/20 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                PNG (লসলেস কোয়ালিটি)
              </button>
            </div>
          </div>

          {/* Quality Slider (for JPEG) */}
          {format === 'image/jpeg' && (
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">ইমেজ কোয়ালিটি:</span>
                <span className="font-mono text-indigo-400 font-bold">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            বাতিল
          </button>

          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="flex-[2] py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : downloadDone ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>ডাউনলোড সম্পন্ন!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t.downloadCleanImage}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

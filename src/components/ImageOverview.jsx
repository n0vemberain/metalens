import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  ShieldAlert, 
  Maximize2, 
  X, 
  Layers, 
  Cpu, 
  Tag
} from 'lucide-react';
import { downloadBlob } from '../utils/metadataParser';

export default function ImageOverview({ 
  file, 
  imageSrc, 
  metadata, 
  onReset, 
  onOpenStripModal, 
  t 
}) {
  const [copied, setCopied] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const { fileInfo, cameraInfo, exposureInfo, dateTimeInfo, gpsInfo } = metadata;

  const handleCopyAll = () => {
    navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(metadata, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${fileInfo.name || 'image'}_metadata.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      {/* Top Banner Card */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-6 shadow-xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Image Thumbnail / Preview */}
          <div className="relative group flex-shrink-0 w-full sm:w-64 h-48 sm:h-52 rounded-xl overflow-hidden bg-slate-950 border border-slate-700/60 shadow-lg">
            <img 
              src={imageSrc} 
              alt={fileInfo.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            <button
              onClick={() => setShowFullImage(true)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity backdrop-blur-xs"
              title="পূর্ণ ছবি দেখুন"
            >
              <Maximize2 className="w-6 h-6 text-white" />
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[11px] font-mono text-slate-200">
              {fileInfo.width && fileInfo.height ? `${fileInfo.width} × ${fileInfo.height}` : fileInfo.humanSize}
            </div>
          </div>

          {/* Quick Highlights Info */}
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate max-w-md" title={fileInfo.name}>
                {fileInfo.name}
              </h2>
              {/* GPS status badge */}
              {gpsInfo.hasGps ? (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t.hasGps}</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-700/50 border border-slate-600/50 text-slate-400 text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5 opacity-50" />
                  <span>{t.noGps}</span>
                </span>
              )}
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="glass-card rounded-xl p-3 border border-slate-700/40">
                <span className="text-[11px] text-slate-400 block mb-0.5">{t.camera}</span>
                <span className="text-sm font-semibold text-white block truncate" title={`${cameraInfo.make || ''} ${cameraInfo.model || 'অজানা'}`}>
                  {cameraInfo.model ? `${cameraInfo.make ? cameraInfo.make + ' ' : ''}${cameraInfo.model}` : 'ক্যামেরা তথ্য নেই'}
                </span>
              </div>

              <div className="glass-card rounded-xl p-3 border border-slate-700/40">
                <span className="text-[11px] text-slate-400 block mb-0.5">{t.dimensions}</span>
                <span className="text-sm font-semibold text-white block">
                  {fileInfo.megapixels ? `${fileInfo.megapixels} MP` : 'N/A'} 
                  <span className="text-xs text-indigo-400 ml-1">({fileInfo.aspectRatio || '1:1'})</span>
                </span>
              </div>

              <div className="glass-card rounded-xl p-3 border border-slate-700/40">
                <span className="text-[11px] text-slate-400 block mb-0.5">{t.fileSize}</span>
                <span className="text-sm font-semibold text-white block">
                  {fileInfo.humanSize}
                </span>
              </div>

              <div className="glass-card rounded-xl p-3 border border-slate-700/40">
                <span className="text-[11px] text-slate-400 block mb-0.5">{t.dateTaken}</span>
                <span className="text-sm font-semibold text-white block truncate" title={dateTimeInfo.dateTaken || 'তারিখ নেই'}>
                  {dateTimeInfo.dateTaken ? dateTimeInfo.dateTaken.split('(')[0] : 'অজানা সময়'}
                </span>
              </div>
            </div>

            {/* Exposure Quick Bar (if available) */}
            {(exposureInfo.aperture || exposureInfo.shutterSpeed || exposureInfo.iso) && (
              <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs mb-5 font-mono">
                {exposureInfo.aperture && (
                  <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                    {exposureInfo.aperture}
                  </span>
                )}
                {exposureInfo.shutterSpeed && (
                  <span className="px-2 py-1 rounded bg-violet-500/20 text-violet-300 font-semibold">
                    {exposureInfo.shutterSpeed}s
                  </span>
                )}
                {exposureInfo.iso && (
                  <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-semibold">
                    ISO {exposureInfo.iso}
                  </span>
                )}
                {exposureInfo.focalLength && (
                  <span className="px-2 py-1 rounded bg-sky-500/20 text-sky-300 font-semibold">
                    {exposureInfo.focalLength}
                  </span>
                )}
                {cameraInfo.lensModel && (
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 truncate max-w-xs font-sans">
                    {cameraInfo.lensModel}
                  </span>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleExportJSON}
                className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.exportJson}</span>
              </button>

              <button
                onClick={handleCopyAll}
                className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.copiedAll : t.copyAll}</span>
              </button>

              <button
                onClick={onOpenStripModal}
                className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition active:scale-95"
                title="মেটাডেটা মুছে নতুন ছবি ডাউনলোড করুন"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>{t.stripMetadata}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showFullImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute -top-12 right-0 p-2 text-slate-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={imageSrc} 
              alt={fileInfo.name} 
              className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl" 
            />
            <p className="mt-2 text-xs text-slate-400 font-mono">
              {fileInfo.name} • {fileInfo.width}×{fileInfo.height} px
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

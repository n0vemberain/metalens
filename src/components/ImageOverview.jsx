import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Download, 
  Copy, 
  Check, 
  ShieldAlert, 
  Maximize2, 
  X, 
  RefreshCw,
  Gauge,
  Sliders,
  Disc,
  Eye,
  Layers
} from 'lucide-react';

export default function ImageOverview({ 
  file, 
  imageSrc, 
  metadata, 
  onReset, 
  onOpenStripModal,
  onExportJson,
  onSelectTab
}) {
  const [copied, setCopied] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const { fileInfo, cameraInfo, exposureInfo, dateTimeInfo, gpsInfo } = metadata;

  const handleCopySummary = () => {
    const summary = [
      `File: ${fileInfo.name}`,
      `Size: ${fileInfo.humanSize}`,
      `Resolution: ${fileInfo.width}x${fileInfo.height} (${fileInfo.megapixels} MP)`,
      `Camera: ${cameraInfo.make || ''} ${cameraInfo.model || 'N/A'}`,
      `Lens: ${cameraInfo.lensModel || 'N/A'}`,
      `Settings: ${exposureInfo.aperture || 'N/A'}, ${exposureInfo.shutterSpeed ? exposureInfo.shutterSpeed + 's' : 'N/A'}, ISO ${exposureInfo.iso || 'N/A'}`,
      `Date: ${dateTimeInfo.dateTaken || 'N/A'}`,
      gpsInfo.hasGps ? `GPS: ${gpsInfo.latitude}, ${gpsInfo.longitude} (Alt: ${gpsInfo.altitude}m)` : 'GPS: None'
    ].join('\n');

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Visual Image Card */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 shadow-xl overflow-hidden relative group">
        <div className="relative aspect-video sm:aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
          <img 
            src={imageSrc} 
            alt={fileInfo.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => setShowFullImage(true)}
          />
          
          <button
            onClick={() => setShowFullImage(true)}
            className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-black/70 hover:bg-black/90 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
            title="View Full Resolution"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="absolute bottom-2 left-2 flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-mono text-slate-200 border border-white/10">
            <span>{fileInfo.width && fileInfo.height ? `${fileInfo.width} × ${fileInfo.height}` : fileInfo.humanSize}</span>
            {fileInfo.megapixels && (
              <>
                <span className="text-slate-500">•</span>
                <span className="text-indigo-300">{fileInfo.megapixels} MP</span>
              </>
            )}
          </div>
        </div>

        {/* File name & quick metrics */}
        <div className="mt-3.5">
          <h2 className="text-sm font-bold text-white truncate" title={fileInfo.name}>
            {fileInfo.name}
          </h2>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[11px] font-mono text-slate-300">
              {fileInfo.humanSize}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[11px] font-mono text-slate-300">
              {fileInfo.aspectRatio || 'Aspect Ratio'}
            </span>
            {gpsInfo.hasGps ? (
              <button 
                onClick={() => onSelectTab('gps')}
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-medium text-emerald-300 hover:bg-emerald-500/25 transition cursor-pointer"
                title="Click to view interactive GPS map"
              >
                <MapPin className="w-3 h-3" />
                <span>GPS Location</span>
              </button>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] text-slate-400">
                <MapPin className="w-3 h-3 opacity-50" />
                <span>No GPS</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Camera & Exposure Box */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Camera className="w-3.5 h-3.5 text-indigo-400" />
            <span>Shooting Summary</span>
          </span>
          {dateTimeInfo.dateTaken && (
            <span className="text-[10px] text-slate-400 font-mono">
              {dateTimeInfo.dateTaken.split(' at ')[0]}
            </span>
          )}
        </div>

        {/* Camera and Lens titles */}
        <div className="space-y-1 mb-3">
          <div className="text-xs font-semibold text-white truncate" title={`${cameraInfo.make || ''} ${cameraInfo.model || 'Unknown Camera'}`}>
            {cameraInfo.model ? `${cameraInfo.make ? cameraInfo.make + ' ' : ''}${cameraInfo.model}` : 'Unknown Camera Hardware'}
          </div>
          {cameraInfo.lensModel && (
            <div className="text-[11px] text-slate-400 truncate" title={cameraInfo.lensModel}>
              {cameraInfo.lensModel}
            </div>
          )}
        </div>

        {/* 4 Exposure Micro-Pills */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[10px]">Aperture</span>
            <span className="font-bold text-indigo-300">{exposureInfo.aperture || 'N/A'}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[10px]">Shutter</span>
            <span className="font-bold text-violet-300">{exposureInfo.shutterSpeed ? `${exposureInfo.shutterSpeed}s` : 'N/A'}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[10px]">ISO</span>
            <span className="font-bold text-amber-300">{exposureInfo.iso || 'N/A'}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[10px]">Focal</span>
            <span className="font-bold text-sky-300">{exposureInfo.focalLength || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-2.5">
        <button
          onClick={onOpenStripModal}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 text-xs font-bold rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition shadow-sm active:scale-98"
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Sanitize & Strip EXIF</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onExportJson}
            className="flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-98"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>
        </div>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-medium text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Upload Different Image</span>
        </button>
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
              {fileInfo.name} • {fileInfo.width} × {fileInfo.height} px
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

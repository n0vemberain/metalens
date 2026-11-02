import React from 'react';
import { FileText, Image as ImageIcon, Palette, Maximize, HardDrive, Calendar, Printer } from 'lucide-react';

export default function FileTab({ fileInfo, colorInfo, dateTimeInfo }) {
  const items = [
    { label: 'File Name', value: fileInfo.name, icon: FileText },
    { label: 'File Size', value: `${fileInfo.humanSize} (${fileInfo.size?.toLocaleString()} bytes)`, icon: HardDrive },
    { label: 'MIME Type', value: fileInfo.type, icon: FileText },
    { 
      label: 'Native Resolution (W × H)', 
      value: fileInfo.width && fileInfo.height ? `${fileInfo.width} × ${fileInfo.height} px` : 'Unavailable', 
      icon: Maximize 
    },
    { label: 'Megapixels', value: fileInfo.megapixels ? `${fileInfo.megapixels} MP` : 'N/A', icon: ImageIcon },
    { label: 'Aspect Ratio', value: fileInfo.aspectRatio || 'N/A', icon: Maximize },
    { label: 'Color Space', value: colorInfo.colorSpace, icon: Palette },
    { label: 'Bit Depth', value: colorInfo.bitsPerSample ? `${colorInfo.bitsPerSample} bits` : '8-bit', icon: Palette },
    { label: 'File Last Modified', value: fileInfo.lastModified, icon: Calendar },
    { label: 'Digitized Timestamp', value: dateTimeInfo.dateDigitized, icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* File Technical Spec Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass-panel rounded-2xl p-4 flex items-center space-x-4 border border-slate-800 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-slate-400 font-medium block mb-0.5">{item.label}</span>
                <span className="text-xs font-semibold text-white truncate block" title={String(item.value || '')}>
                  {item.value || <span className="text-slate-500 font-normal italic">Unavailable</span>}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Print Quality & Dimension Calculator */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
          <Printer className="w-4 h-4 text-indigo-400" />
          <span>Print Size & Resolution Estimator</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          Based on the native resolution of {fileInfo.width ? `${fileInfo.width}×${fileInfo.height} px` : 'your image'}, here are the calculated physical print dimensions across standard printing standards:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-bold text-indigo-300 block mb-1">300 DPI — Fine Art & Gallery</span>
            <span className="text-xs text-slate-400 block mb-2">Maximum sharpness for close inspection</span>
            <div className="text-sm font-bold font-mono text-white">
              {fileInfo.print300 ? fileInfo.print300.inches : 'N/A'}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {fileInfo.print300 ? fileInfo.print300.cm : ''}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-bold text-violet-300 block mb-1">240 DPI — Editorial & Magazine</span>
            <span className="text-xs text-slate-400 block mb-2">Standard commercial photo publishing</span>
            <div className="text-sm font-bold font-mono text-white">
              {fileInfo.print240 ? fileInfo.print240.inches : 'N/A'}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {fileInfo.print240 ? fileInfo.print240.cm : ''}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-bold text-sky-300 block mb-1">150 DPI — Poster & Wall Display</span>
            <span className="text-xs text-slate-400 block mb-2">Optimum for viewing from a few feet away</span>
            <div className="text-sm font-bold font-mono text-white">
              {fileInfo.print150 ? fileInfo.print150.inches : 'N/A'}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {fileInfo.print150 ? fileInfo.print150.cm : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

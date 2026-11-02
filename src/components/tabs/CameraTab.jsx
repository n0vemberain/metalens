import React from 'react';
import { Camera, Disc, Gauge, Sliders, Eye, Cpu, Zap, Sun, Info } from 'lucide-react';

export default function CameraTab({ cameraInfo, exposureInfo, dateTimeInfo }) {
  const cards = [
    {
      title: 'Aperture (F-Stop)',
      value: exposureInfo.aperture || 'N/A',
      desc: 'Controls depth of field and optical light intake',
      icon: Disc,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      title: 'Shutter Speed',
      value: exposureInfo.shutterSpeed ? `${exposureInfo.shutterSpeed}s` : 'N/A',
      desc: 'Duration of sensor exposure to light',
      icon: Gauge,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20'
    },
    {
      title: 'ISO Sensitivity',
      value: exposureInfo.iso ? `ISO ${exposureInfo.iso}` : 'N/A',
      desc: 'Sensor digital signal sensitivity level',
      icon: Sliders,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      title: 'Focal Length',
      value: exposureInfo.focalLength || 'N/A',
      subValue: exposureInfo.focalLength35mm ? `(${exposureInfo.focalLength35mm} 35mm eq.)` : null,
      desc: 'Lens optical focal distance',
      icon: Eye,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20'
    }
  ];

  const specsList = [
    { label: 'Camera Make & Model', value: cameraInfo.model ? `${cameraInfo.make || ''} ${cameraInfo.model}`.trim() : null },
    { label: 'Lens Model', value: cameraInfo.lensModel },
    { label: 'Lens Make', value: cameraInfo.lensMake },
    { label: 'Exposure Program', value: exposureInfo.exposureProgram },
    { label: 'Metering Mode', value: exposureInfo.meteringMode },
    { label: 'Flash Mode & Firing', value: exposureInfo.flash },
    { label: 'White Balance', value: exposureInfo.whiteBalance },
    { label: 'Exposure Bias (EV)', value: exposureInfo.exposureBias },
    { label: 'Software / Firmware', value: cameraInfo.software },
    { label: 'Date & Time Original', value: dateTimeInfo.dateTaken },
    { label: 'Date & Time Digitized', value: dateTimeInfo.dateDigitized },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Primary Exposure Dial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className={`glass-panel rounded-2xl p-5 border ${card.border} relative overflow-hidden transition-all hover:scale-[1.01] shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300">{card.title}</span>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-tight mb-1">
                {card.value}
              </div>
              {card.subValue && (
                <div className="text-xs text-slate-400 font-mono mb-2">
                  {card.subValue}
                </div>
              )}
              <p className="text-[11px] text-slate-400">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Shooting & Gear Specifications */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
          <Camera className="w-4 h-4 text-indigo-400" />
          <span>Camera Hardware & Shooting Parameters</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {specsList.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2.5 border-b border-slate-800/80">
              <span className="text-xs text-slate-400 font-medium">{item.label}</span>
              <span className="text-xs font-semibold text-slate-100 max-w-xs text-right truncate" title={item.value || ''}>
                {item.value || <span className="text-slate-500 font-normal italic">Unavailable</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

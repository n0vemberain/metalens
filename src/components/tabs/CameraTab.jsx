import React from 'react';
import { Camera, Zap, Sun, Gauge, Eye, Sliders, Disc, Cpu, Info } from 'lucide-react';

export default function CameraTab({ cameraInfo, exposureInfo, dateTimeInfo, t }) {
  const cards = [
    {
      title: t.aperture,
      value: exposureInfo.aperture || 'N/A',
      desc: 'ডেপথ অব ফিল্ড ও আলোর পরিমাণ',
      icon: Disc,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      title: t.shutterSpeed,
      value: exposureInfo.shutterSpeed ? `${exposureInfo.shutterSpeed}s` : 'N/A',
      desc: 'সেন্সরে আলো প্রবেশের সময়সীমা',
      icon: Gauge,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20'
    },
    {
      title: t.iso,
      value: exposureInfo.iso ? `ISO ${exposureInfo.iso}` : 'N/A',
      desc: 'সেন্সর আলোক সংবেদনশীলতা',
      icon: Sliders,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      title: t.focalLength,
      value: exposureInfo.focalLength || 'N/A',
      subValue: exposureInfo.focalLength35mm ? `(${exposureInfo.focalLength35mm} 35mm eq.)` : null,
      desc: 'লেন্সের ফোকাস দূরত্ব',
      icon: Eye,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20'
    }
  ];

  const detailsList = [
    { label: t.camera, value: cameraInfo.model ? `${cameraInfo.make || ''} ${cameraInfo.model}` : null },
    { label: t.lens, value: cameraInfo.lensModel },
    { label: t.exposureProgram, value: exposureInfo.exposureProgram },
    { label: t.meteringMode, value: exposureInfo.meteringMode },
    { label: t.flash, value: exposureInfo.flash },
    { label: t.whiteBalance, value: exposureInfo.whiteBalance },
    { label: t.exposureBias, value: exposureInfo.exposureBias },
    { label: t.software, value: cameraInfo.software },
    { label: t.dateTaken, value: dateTimeInfo.dateTaken },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Primary Exposure Dial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`glass-panel rounded-2xl p-5 border ${card.border} relative overflow-hidden transition-all hover:scale-[1.02]`}>
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

      {/* Detailed Camera & Hardware Specification Table */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <Camera className="w-4 h-4 text-indigo-400" />
          <span>ক্যামেরা ও শুটিংয়ের বিস্তারিত বিবরণ</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {detailsList.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-xs text-slate-400 font-medium">{item.label}</span>
              <span className="text-xs font-semibold text-slate-100 max-w-xs text-right truncate" title={item.value || ''}>
                {item.value || <span className="text-slate-500 font-normal italic">অনুপলব্ধ</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

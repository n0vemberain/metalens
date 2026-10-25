import React from 'react';
import { ShieldCheck, Heart, Cpu, FileCode2 } from 'lucide-react';

export default function Footer({ t }) {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/60 py-8 px-4 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">
            ১০০% নিরাপদ ও গোপনীয় — সব মেটাডেটা আপনার ব্রাউজারেই সরাসরি প্রসেস হয়।
          </span>
        </div>

        <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
          <span>EXIF 2.32</span>
          <span>•</span>
          <span>IPTC</span>
          <span>•</span>
          <span>XMP</span>
          <span>•</span>
          <span>GPS</span>
          <span>•</span>
          <span>ICC Profile</span>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { ShieldCheck, Camera } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            100% Client-Side & Private — Images are processed strictly within your local browser memory.
          </span>
        </div>

        <div className="flex items-center space-x-3 text-slate-500 font-mono text-[11px]">
          <span>EXIF 2.32</span>
          <span>•</span>
          <span>IPTC Core</span>
          <span>•</span>
          <span>XMP</span>
          <span>•</span>
          <span>GPS Geotags</span>
          <span>•</span>
          <span>ICC Profiles</span>
        </div>
      </div>
    </footer>
  );
}

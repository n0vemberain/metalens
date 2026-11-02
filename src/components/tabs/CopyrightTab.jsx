import React from 'react';
import { User, Shield, FileText, Cpu, Calendar, Tag, ShieldCheck } from 'lucide-react';

export default function CopyrightTab({ copyrightInfo, cameraInfo, dateTimeInfo }) {
  const fields = [
    { label: 'Photographer / Artist (By-line)', value: copyrightInfo.artist, icon: User },
    { label: 'Copyright Notice', value: copyrightInfo.copyright, icon: Shield },
    { label: 'Headline / Title', value: copyrightInfo.title, icon: Tag },
    { label: 'Caption / Image Description', value: copyrightInfo.description, icon: FileText },
    { label: 'Processing & Editing Software', value: cameraInfo.software, icon: Cpu },
    { label: 'Creation Timestamp', value: dateTimeInfo.dateTaken, icon: Calendar },
    { label: 'Digital Modification Timestamp', value: dateTimeInfo.dateModified, icon: Calendar },
  ];

  const hasAnyRights = Boolean(
    copyrightInfo.artist || 
    copyrightInfo.copyright || 
    copyrightInfo.description || 
    copyrightInfo.title
  );

  return (
    <div className="space-y-6">
      {/* Rights Summary Status Banner */}
      <div className={`glass-panel rounded-2xl p-5 border ${hasAnyRights ? 'border-emerald-500/30 bg-emerald-950/15' : 'border-slate-800'} shadow-md`}>
        <div className="flex items-center space-x-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasAnyRights ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {hasAnyRights ? 'Author & Legal Copyright Information Detected' : 'No Explicit Creator or Copyright Metadata Attached'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {hasAnyRights 
                ? 'Embedded IPTC and EXIF tags identify the creator, intellectual property rights, and image description.' 
                : 'No creator name, copyright attribution, or caption tags were embedded during export.'}
            </p>
          </div>
        </div>
      </div>

      {/* Creator & Rights Fields Table */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl">
        <h4 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
          <User className="w-4 h-4 text-indigo-400" />
          <span>Creator, Rights & Editorial Metadata</span>
        </h4>

        <div className="space-y-3">
          {fields.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 gap-2"
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-300">{f.label}</span>
                </div>
                <div className="text-xs font-semibold text-indigo-300 sm:text-right max-w-lg break-words">
                  {f.value || <span className="text-slate-500 font-normal italic">Unavailable</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

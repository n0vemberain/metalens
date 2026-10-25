import React from 'react';
import { User, Shield, FileText, Cpu, Calendar, Tag, CheckCircle } from 'lucide-react';

export default function CopyrightTab({ copyrightInfo, cameraInfo, dateTimeInfo, t }) {
  const fields = [
    { label: 'ফটোগ্রাফার / শিল্পী (Artist)', value: copyrightInfo.artist, icon: User },
    { label: 'কপিরাইট স্বত্বাধিকার (Copyright)', value: copyrightInfo.copyright, icon: Shield },
    { label: 'শিরোনাম / শিরোনাম (Title / Headline)', value: copyrightInfo.title, icon: Tag },
    { label: 'বিবরণ / ক্যাপশন (Description)', value: copyrightInfo.description, icon: FileText },
    { label: 'এডিটিং সফটওয়্যার (Software / Tool)', value: cameraInfo.software, icon: Cpu },
    { label: 'মূল ছবি তোলার সময়', value: dateTimeInfo.dateTaken, icon: Calendar },
    { label: 'ডিজিটাল সম্পাদনার সময়', value: dateTimeInfo.dateModified, icon: Calendar },
  ];

  const hasAnyRights = Boolean(
    copyrightInfo.artist || 
    copyrightInfo.copyright || 
    copyrightInfo.description || 
    copyrightInfo.title
  );

  return (
    <div className="space-y-6">
      {/* Rights summary status */}
      <div className={`glass-panel rounded-2xl p-4 sm:p-5 border ${hasAnyRights ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800'}`}>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasAnyRights ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {hasAnyRights ? 'ছবিটিতে ক্রিয়েটর ও আইনি স্বত্বাধিকার তথ্য বিদ্যমান' : 'কোনো আনুষ্ঠানিক কপিরাইট বা শিল্পী ট্যাগ সংযুক্ত নেই'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {hasAnyRights ? 'IPTC এবং EXIF ট্যাগ থেকে সংরক্ষিত কপিরাইট ও শিল্পী সংক্রান্ত তথ্য শনাক্ত হয়েছে।' : 'ক্যামেরা অথবা সফটওয়্যার এক্সপোর্টের সময় কোনো লেখক বা স্বত্বাধিকারের নাম যুক্ত করা হয়নি।'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of rights metadata */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800">
        <h4 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
          <User className="w-4 h-4 text-indigo-400" />
          <span>ক্রিয়েটর, বর্ণনা ও মেটাডাটা অধিকার বিবরণ</span>
        </h4>

        <div className="space-y-4">
          {fields.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 gap-1.5">
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-300">{f.label}</span>
                </div>
                <div className="text-xs font-semibold text-indigo-300 sm:text-right max-w-lg break-words">
                  {f.value || <span className="text-slate-500 font-normal italic">অনুপলব্ধ</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

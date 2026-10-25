import React from 'react';
import { FileText, Image as ImageIcon, Palette, Maximize, HardDrive, Calendar } from 'lucide-react';

export default function FileTab({ fileInfo, colorInfo, dateTimeInfo, t }) {
  const items = [
    { label: t.fileName, value: fileInfo.name, icon: FileText },
    { label: t.fileSize, value: `${fileInfo.humanSize} (${fileInfo.size?.toLocaleString()} bytes)`, icon: HardDrive },
    { label: 'MIME Type', value: fileInfo.type, icon: FileText },
    { 
      label: 'রেজোলিউশন (W × H)', 
      value: fileInfo.width && fileInfo.height ? `${fileInfo.width} × ${fileInfo.height} px` : 'অজানা', 
      icon: Maximize 
    },
    { label: 'মেগাপিক্সেল', value: fileInfo.megapixels ? `${fileInfo.megapixels} MP` : 'N/A', icon: ImageIcon },
    { label: t.aspectRatio, value: fileInfo.aspectRatio || 'N/A', icon: Maximize },
    { label: 'কালার স্পেস (Color Space)', value: colorInfo.colorSpace, icon: Palette },
    { label: 'বিট ডেপথ (Bit Depth)', value: colorInfo.bitsPerSample ? `${colorInfo.bitsPerSample} bits` : '8-bit', icon: Palette },
    { label: 'সর্বশেষ পরিবর্তনের তারিখ', value: fileInfo.lastModified, icon: Calendar },
    { label: 'ডিজিটাইজ করার তারিখ', value: dateTimeInfo.dateDigitized, icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass-panel rounded-2xl p-4 flex items-center space-x-4 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-slate-400 font-medium block mb-0.5">{item.label}</span>
                <span className="text-sm font-semibold text-white truncate block" title={String(item.value || '')}>
                  {item.value || <span className="text-slate-500 font-normal italic">অনুপলব্ধ</span>}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resolution & Aspect Ratio Insight Box */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
          <ImageIcon className="w-4 h-4 text-indigo-400" />
          <span>রেজোলিউশন ও প্রিন্ট সাইজ অনুমান (300 DPI প্রিন্ট)</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {fileInfo.width && fileInfo.height ? (
            <>
              বর্তমান <strong>{fileInfo.width}×{fileInfo.height} px</strong> রেজোলিউশনের ছবিটি উচ্চমানের ৩০০ ডিপিআই (300 DPI) প্রিন্টের ক্ষেত্রে প্রায়{' '}
              <strong>{(fileInfo.width / 300).toFixed(1)}" × {(fileInfo.height / 300).toFixed(1)}" ইঞ্চি</strong> আকারে স্পষ্ট ও নিখুঁতভাবে প্রিন্ট করা যাবে।
            </>
          ) : (
            'রেজোলিউশন তথ্য অপর্যাপ্ত।'
          )}
        </p>

        <div className="flex items-center space-x-4 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
          <div>অ্যাসপেক্ট রেশিও: <span className="text-indigo-400 font-bold">{fileInfo.aspectRatio || 'N/A'}</span></div>
          <div>•</div>
          <div>টোটাল পিক্সেল: <span className="text-indigo-400 font-bold">{fileInfo.width && fileInfo.height ? (fileInfo.width * fileInfo.height).toLocaleString() : 'N/A'} px</span></div>
        </div>
      </div>
    </div>
  );
}

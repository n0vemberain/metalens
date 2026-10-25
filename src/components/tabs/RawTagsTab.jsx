import React, { useState, useMemo } from 'react';
import { Search, Filter, Copy, Check, Hash, ArrowUpDown } from 'lucide-react';

export default function RawTagsTab({ allTags, t }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  // Extract unique groups
  const availableGroups = useMemo(() => {
    const groups = new Set();
    allTags.forEach(tag => {
      if (tag.group) groups.add(tag.group);
    });
    return ['ALL', ...Array.from(groups).sort()];
  }, [allTags]);

  // Filter tags based on search and group
  const filteredTags = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return allTags.filter(tag => {
      const matchesGroup = selectedGroup === 'ALL' || tag.group === selectedGroup;
      if (!matchesGroup) return false;
      if (!q) return true;
      return (
        tag.name.toLowerCase().includes(q) ||
        tag.description.toLowerCase().includes(q) ||
        tag.value.toLowerCase().includes(q) ||
        tag.group.toLowerCase().includes(q)
      );
    });
  }, [allTags, searchTerm, selectedGroup]);

  const handleCopyTag = (tag) => {
    navigator.clipboard.writeText(`${tag.name}: ${tag.description || tag.value}`);
    setCopiedId(tag.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const getGroupBadgeColor = (group) => {
    switch (group) {
      case 'EXIF':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'GPS':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'IPTC':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'XMP':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'ICC':
        return 'bg-pink-500/15 text-pink-300 border-pink-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Group Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {availableGroups.map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedGroup === grp
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              {grp === 'ALL' ? t.allGroups : grp}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>{t.totalTagsFound.replace('{count}', filteredTags.length)}</span>
        <span>ক্লিপবোর্ডে কপি করতে সারির ডানপাশে ক্লিক করুন</span>
      </div>

      {/* Raw Tags Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-950/95 backdrop-blur-md text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800 z-10">
              <tr>
                <th className="py-3 px-4 w-24">{t.tagGroup}</th>
                <th className="py-3 px-4 w-1/3">{t.tagName}</th>
                <th className="py-3 px-4">{t.tagDescription}</th>
                <th className="py-3 px-4 text-right w-16">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-slate-800/40 transition group">
                    <td className="py-2.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getGroupBadgeColor(tag.group)}`}>
                        {tag.group}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-indigo-300">
                      {tag.name}
                    </td>
                    <td className="py-2.5 px-4 text-slate-200 font-mono break-words max-w-xl">
                      {tag.description || tag.value}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => handleCopyTag(tag)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                        title={t.copyTag}
                      >
                        {copiedId === tag.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500 italic">
                    {t.noTagsMatch}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

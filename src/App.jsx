import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dropzone from './components/Dropzone';
import ImageOverview from './components/ImageOverview';
import CameraTab from './components/tabs/CameraTab';
import GpsTab from './components/tabs/GpsTab';
import FileTab from './components/tabs/FileTab';
import CopyrightTab from './components/tabs/CopyrightTab';
import RawTagsTab from './components/tabs/RawTagsTab';
import StripMetadataModal from './components/StripMetadataModal';
import Footer from './components/Footer';
import { translations } from './utils/translations';
import { parseImageMetadata } from './utils/metadataParser';
import { Camera, MapPin, FileText, Shield, Layers } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('bn');
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('camera');
  const [isStripModalOpen, setIsStripModalOpen] = useState(false);

  const t = translations[lang] || translations.bn;

  const handleFileSelected = async (selectedFile) => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);

    try {
      const src = URL.createObjectURL(selectedFile);
      setImageSrc(src);
      setFile(selectedFile);

      const parsed = await parseImageMetadata(selectedFile);
      setMetadata(parsed);
      
      // If GPS exists, or camera info exists, switch to appropriate tab
      if (parsed.cameraInfo?.model || parsed.exposureInfo?.shutterSpeed) {
        setActiveTab('camera');
      } else if (parsed.gpsInfo?.hasGps) {
        setActiveTab('gps');
      } else {
        setActiveTab('file');
      }
    } catch (err) {
      console.error('Error processing image:', err);
      setError('ছবি বিশ্লেষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে অন্য কোনো বৈধ ছবি চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
    setFile(null);
    setImageSrc(null);
    setMetadata(null);
    setError(null);
  };

  const tabs = [
    { id: 'camera', label: t.tabCamera, icon: Camera, badge: metadata?.cameraInfo?.model },
    { id: 'gps', label: t.tabGps, icon: MapPin, badge: metadata?.gpsInfo?.hasGps ? 'GPS' : null, isGps: true },
    { id: 'file', label: t.tabFile, icon: FileText },
    { id: 'copyright', label: t.tabCopyright, icon: Shield },
    { id: 'allTags', label: t.tabAllTags, icon: Layers, count: metadata?.allTags?.length },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Navbar */}
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        hasImage={Boolean(metadata)} 
        onReset={handleReset} 
        t={t} 
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {!metadata ? (
          <Dropzone 
            onFileSelected={handleFileSelected} 
            isLoading={isLoading} 
            t={t} 
          />
        ) : (
          <div className="w-full">
            {/* Top Overview & Action Bar */}
            <ImageOverview 
              file={file}
              imageSrc={imageSrc}
              metadata={metadata}
              onReset={handleReset}
              onOpenStripModal={() => setIsStripModalOpen(true)}
              t={t}
            />

            {/* Navigation Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
              <div className="flex items-center space-x-2 border-b border-slate-800 overflow-x-auto pb-2 scrollbar-none">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          {tab.count}
                        </span>
                      )}
                      {tab.isGps && tab.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Contents */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              {activeTab === 'camera' && (
                <CameraTab 
                  cameraInfo={metadata.cameraInfo}
                  exposureInfo={metadata.exposureInfo}
                  dateTimeInfo={metadata.dateTimeInfo}
                  t={t}
                />
              )}

              {activeTab === 'gps' && (
                <GpsTab 
                  gpsInfo={metadata.gpsInfo}
                  t={t}
                />
              )}

              {activeTab === 'file' && (
                <FileTab 
                  fileInfo={metadata.fileInfo}
                  colorInfo={metadata.colorInfo}
                  dateTimeInfo={metadata.dateTimeInfo}
                  t={t}
                />
              )}

              {activeTab === 'copyright' && (
                <CopyrightTab 
                  copyrightInfo={metadata.copyrightInfo}
                  cameraInfo={metadata.cameraInfo}
                  dateTimeInfo={metadata.dateTimeInfo}
                  t={t}
                />
              )}

              {activeTab === 'allTags' && (
                <RawTagsTab 
                  allTags={metadata.allTags}
                  t={t}
                />
              )}
            </div>
          </div>
        )}

        {/* Strip Metadata Privacy Modal */}
        <StripMetadataModal
          isOpen={isStripModalOpen}
          onClose={() => setIsStripModalOpen(false)}
          file={file}
          t={t}
        />
      </main>

      {/* Footer */}
      <Footer t={t} />
    </div>
  );
}

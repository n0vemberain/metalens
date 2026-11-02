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
import { parseImageMetadata } from './utils/metadataParser';
import { Camera, MapPin, FileText, Shield, Layers, AlertCircle } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('camera');
  const [isStripModalOpen, setIsStripModalOpen] = useState(false);

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
      
      // Smart tab selection based on available data
      if (parsed.cameraInfo?.model || parsed.exposureInfo?.shutterSpeed) {
        setActiveTab('camera');
      } else if (parsed.gpsInfo?.hasGps) {
        setActiveTab('gps');
      } else {
        setActiveTab('file');
      }
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to extract metadata from this file. Please verify that the image format is valid and try again.');
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

  const handleExportJson = () => {
    if (!metadata) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(metadata, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${metadata.fileInfo.name || 'image'}_metadata.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const loadSample = async (samplePath, sampleName) => {
    try {
      const response = await fetch(samplePath);
      const blob = await response.blob();
      const sampleFile = new File([blob], sampleName, { type: 'image/jpeg' });
      handleFileSelected(sampleFile);
    } catch (err) {
      console.error('Failed to load sample image:', err);
    }
  };

  const tabs = [
    { 
      id: 'camera', 
      label: 'Camera & Gear', 
      icon: Camera, 
      badge: metadata?.cameraInfo?.model ? 'EXIF' : null 
    },
    { 
      id: 'gps', 
      label: 'GPS & Location', 
      icon: MapPin, 
      badge: metadata?.gpsInfo?.hasGps ? 'GPS' : null, 
      isGps: true 
    },
    { 
      id: 'file', 
      label: 'File & Color Specs', 
      icon: FileText 
    },
    { 
      id: 'copyright', 
      label: 'Author & Rights', 
      icon: Shield 
    },
    { 
      id: 'allTags', 
      label: 'Raw Tags', 
      icon: Layers, 
      count: metadata?.allTags?.length 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Studio Navbar */}
      <Navbar 
        hasImage={Boolean(metadata)} 
        onReset={handleReset} 
        onOpenStripModal={() => setIsStripModalOpen(true)}
        onExportJson={handleExportJson}
      />

      {/* Main Studio Area */}
      <main className="flex-1 w-full">
        {error && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              <p className="text-xs sm:text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {!metadata ? (
          <Dropzone 
            onFileSelected={handleFileSelected} 
            isLoading={isLoading} 
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* 2-Column Studio Workbench Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Visual & Quick Inspector Sidebar */}
              <div className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-20">
                <ImageOverview 
                  file={file}
                  imageSrc={imageSrc}
                  metadata={metadata}
                  onReset={handleReset}
                  onOpenStripModal={() => setIsStripModalOpen(true)}
                  onExportJson={handleExportJson}
                  onSelectTab={(tabId) => setActiveTab(tabId)}
                />
              </div>

              {/* Right Column: Detailed Analysis Workbench */}
              <div className="lg:col-span-8 xl:col-span-8 space-y-6">
                
                {/* Segmented Tab Navigation Header */}
                <div className="glass-panel rounded-2xl p-1.5 border border-slate-800 shadow-md">
                  <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
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

                {/* Tab Content Display */}
                <div>
                  {activeTab === 'camera' && (
                    <CameraTab 
                      cameraInfo={metadata.cameraInfo}
                      exposureInfo={metadata.exposureInfo}
                      dateTimeInfo={metadata.dateTimeInfo}
                    />
                  )}

                  {activeTab === 'gps' && (
                    <GpsTab 
                      gpsInfo={metadata.gpsInfo}
                      onLoadSample={loadSample}
                    />
                  )}

                  {activeTab === 'file' && (
                    <FileTab 
                      fileInfo={metadata.fileInfo}
                      colorInfo={metadata.colorInfo}
                      dateTimeInfo={metadata.dateTimeInfo}
                    />
                  )}

                  {activeTab === 'copyright' && (
                    <CopyrightTab 
                      copyrightInfo={metadata.copyrightInfo}
                      cameraInfo={metadata.cameraInfo}
                      dateTimeInfo={metadata.dateTimeInfo}
                    />
                  )}

                  {activeTab === 'allTags' && (
                    <RawTagsTab 
                      allTags={metadata.allTags}
                    />
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Strip Metadata Privacy Modal */}
        <StripMetadataModal
          isOpen={isStripModalOpen}
          onClose={() => setIsStripModalOpen(false)}
          file={file}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ExternalLink, Copy, Check, Navigation, Mountain, AlertCircle } from 'lucide-react';
import L from 'leaflet';

export default function GpsTab({ gpsInfo, t }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!gpsInfo?.hasGps || !mapContainerRef.current) return;

    const { latitude, longitude } = gpsInfo;

    // Fix standard Leaflet default icon in bundlers
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // Cleanup previous map if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current).setView([latitude, longitude], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([latitude, longitude]).addTo(map);
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
          <strong>ছবির লোকেশন</strong><br/>
          স্থানাঙ্ক: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}
        </div>
      `).openPopup();

      mapInstanceRef.current = map;
      
      // Invalidate size after mount animation
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    } catch (err) {
      console.error('Failed to initialize map:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [gpsInfo]);

  const handleCopy = () => {
    if (!gpsInfo?.hasGps) return;
    const text = `${gpsInfo.latitude}, ${gpsInfo.longitude}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!gpsInfo?.hasGps) {
    return (
      <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center border border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{t.noGpsTitle}</h3>
        <p className="text-sm text-slate-300 max-w-lg mx-auto mb-6">
          {t.noGpsDesc}
        </p>
        <div className="inline-flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
          <span>টিপস: জিপিএস টেস্ট করার জন্য উপরের "আইফোন ১৫ প্রো" বা "ক্যানন EOS R5" নমুনা ছবিতে ক্লিক করুন।</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Location Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">{t.latitude}</span>
            <Navigation className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{gpsInfo.latitude}°</div>
          <div className="text-xs text-slate-400 font-mono mt-1">{gpsInfo.latitudeDMS}</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">{t.longitude}</span>
            <Navigation className="w-4 h-4 text-emerald-400 transform rotate-90" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{gpsInfo.longitude}°</div>
          <div className="text-xs text-slate-400 font-mono mt-1">{gpsInfo.longitudeDMS}</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">{t.altitude}</span>
            <Mountain className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {gpsInfo.altitude !== null ? `${gpsInfo.altitude} m` : 'N/A'}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {gpsInfo.altitude !== null ? `সমুদ্রপৃষ্ঠ হতে প্রায় ${(gpsInfo.altitude * 3.28084).toFixed(0)} ফুট` : 'উচ্চতার তথ্য নেই'}
          </div>
        </div>
      </div>

      {/* Map Card */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">স্যাটেলাইট ও ওপেনস্ট্রিটম্যাপ লোকেশন</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.coordinatesCopied : t.copyCoordinates}</span>
            </button>

            <a
              href={gpsInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t.openGoogleMaps}</span>
            </a>

            <a
              href={gpsInfo.openStreetMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t.openOsm}</span>
            </a>
          </div>
        </div>

        {/* Leaflet Map DOM Node */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-slate-700 shadow-inner z-0"
        />
      </div>
    </div>
  );
}

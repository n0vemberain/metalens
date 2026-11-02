import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ExternalLink, Copy, Check, Navigation, Mountain, AlertCircle } from 'lucide-react';
import L from 'leaflet';

export default function GpsTab({ gpsInfo, onLoadSample }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!gpsInfo?.hasGps || !mapContainerRef.current) return;

    const { latitude, longitude } = gpsInfo;

    // Fix standard Leaflet default icon path in modern bundlers
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

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
          <strong>Capture Geolocation</strong><br/>
          Coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}
        </div>
      `).openPopup();

      mapInstanceRef.current = map;
      
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
      <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center border border-slate-800 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No GPS Geolocation Detected</h3>
        <p className="text-sm text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
          This image does not contain embedded GPS coordinates. Geolocation was either disabled during capture or was stripped when saved, compressed, or shared via messaging platforms.
        </p>
        {onLoadSample && (
          <div className="inline-flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onLoadSample('/samples/iphone15_coxsbazar.jpg', 'iphone15_coxsbazar.jpg')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
            >
              Load Sample with GPS (iPhone 15 Pro)
            </button>
            <button
              onClick={() => onLoadSample('/samples/sony_a7iv_dhaka.jpg', 'sony_a7iv_dhaka.jpg')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
            >
              Load Sample with GPS (Sony A7 IV)
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Geolocation Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Latitude</span>
            <Navigation className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{gpsInfo.latitude}°</div>
          <div className="text-xs text-slate-400 font-mono mt-1">{gpsInfo.latitudeDMS}</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Longitude</span>
            <Navigation className="w-4 h-4 text-emerald-400 transform rotate-90" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{gpsInfo.longitude}°</div>
          <div className="text-xs text-slate-400 font-mono mt-1">{gpsInfo.longitudeDMS}</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Altitude</span>
            <Mountain className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {gpsInfo.altitude !== null ? `${gpsInfo.altitude} m` : 'N/A'}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {gpsInfo.altitude !== null 
              ? `Approx. ${(gpsInfo.altitude * 3.28084).toFixed(0)} ft above sea level` 
              : 'Altitude data unavailable'}
          </div>
        </div>
      </div>

      {/* Interactive Map Box */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Interactive OpenStreetMap Geolocation</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Coordinates'}</span>
            </button>

            <a
              href={gpsInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </a>

            <a
              href={gpsInfo.openStreetMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>OpenStreetMap</span>
            </a>
          </div>
        </div>

        {/* Leaflet Map DOM Node */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-slate-800 shadow-inner z-0"
        />
      </div>
    </div>
  );
}

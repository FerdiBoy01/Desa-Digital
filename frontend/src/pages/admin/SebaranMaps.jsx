import React, { useEffect, useState } from 'react';
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // WAJIB IMPORT CSS INI
import { useDispatch, useSelector } from "react-redux";
import { getAllBiodata } from "../../features/biodataSlice";
import L from 'leaflet';
import { FaMapMarkedAlt } from 'react-icons/fa';

// --- HACK UNTUK ICON LEAFLET AGAR MUNCUL DI REACT ---
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const SebaranMaps = () => {
  const dispatch = useDispatch();
  const { biodataList } = useSelector((state) => state.biodata);
  
  // Koordinat Default (Misal: Kantor Desa / Pusat Kota)
  // Ganti angka ini dengan koordinat desamu (Buka Google Maps, klik kanan, copy)
  const centerPosition = [0.342898, 101.023440]; // Contoh: Jakarta

  useEffect(() => {
    dispatch(getAllBiodata());
  }, [dispatch]);

  // --- FUNGSI MEMBUAT ICON BERWARNA ---
  // Kita pakai trik CSS filter hue-rotate untuk ganti warna icon biru default
  const getIcon = (status) => {
    let filterColor = "";
    
    if (status === "Disetujui") {
        filterColor = "hue-rotate(260deg) saturate(3) brightness(0.8)"; // Hijau (kira-kira)
    } else if (status === "Ditolak") {
        filterColor = "hue-rotate(140deg) saturate(3)"; // Merah
    } else {
        filterColor = "hue-rotate(0deg)"; // Biru/Kuning (Default)
    }

    return new L.Icon({
        iconUrl: iconMarker,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        className: "custom-marker-icon" // Kita inject style manual nanti
    });
  };

  // --- VALIDASI DATA KOORDINAT ---
  // Hanya tampilkan data yang punya latitude & longitude valid
  const validLocations = biodataList ? biodataList.filter(item => item.latitude && item.longitude) : [];

  return (
    <LayoutAdmin>
        <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <FaMapMarkedAlt className="text-indigo-600"/> Peta Sebaran Penerima
            </h2>
            <p className="text-sm text-slate-500 mt-1">
                Visualisasi lokasi rumah warga berdasarkan status pengajuan.
            </p>
        </div>

        {/* --- LEGENDA PETA --- */}
        <div className="flex gap-4 mb-4 text-sm font-medium">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span> Disetujui
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span> Menunggu
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span> Ditolak
            </div>
        </div>

        {/* --- MAP CONTAINER --- */}
        <div className="rounded-xl overflow-hidden border border-slate-300 shadow-lg h-[500px] relative z-0">
            <MapContainer center={centerPosition} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                {/* Skin Peta (OpenStreetMap) */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Render Marker */}
                {validLocations.map((item) => (
                    <Marker 
                        key={item.uuid} 
                        position={[item.latitude, item.longitude]}
                        // Disini kita bisa kustom icon berdasarkan status, tapi untuk simpel pakai default dulu
                        // Nanti saya ajarkan cara custom icon warna-warni jika perlu
                    >
                        <Popup>
                            <div className="text-center">
                                <strong className="block text-indigo-700">{item.user?.name}</strong>
                                <span className={`text-xs px-2 py-0.5 rounded text-white font-bold
                                    ${item.status_pengajuan === 'Disetujui' ? 'bg-green-500' : 
                                      item.status_pengajuan === 'Ditolak' ? 'bg-red-500' : 'bg-blue-500'}`
                                }>
                                    {item.status_pengajuan}
                                </span>
                                <p className="text-xs text-slate-500 mt-1">{item.alamat_lengkap}</p>
                                <a href={`/surveys/detail/${item.uuid}`} className="text-xs text-blue-600 underline mt-2 block">Lihat Detail</a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    </LayoutAdmin>
  );
};

export default SebaranMaps;
"use client";

import { useEffect, useRef, useState } from "react";
import { X, MapPin, Navigation, Loader2, ExternalLink } from "lucide-react";

interface AddressMapViewProps {
    address: string;
    customerName?: string;
    onClose: () => void;
}

const DEFAULT_LAT = 27.7172;
const DEFAULT_LNG = 85.3240;

export default function AddressMapView({ address, customerName, onClose }: AddressMapViewProps) {
    const mapRef     = useRef<HTMLDivElement>(null);
    const leafletRef = useRef<any>(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(false);
    const [coords, setCoords]     = useState<{ lat: number; lng: number } | null>(null);
    const [locating, setLocating] = useState(false);

    // Forward geocode the address string → coordinates
    const geocodeAddress = async (addr: string): Promise<{ lat: number; lng: number } | null> => {
        try {
            const res  = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addr)}&format=json&limit=1`
            );
            const data = await res.json();
            if (data?.[0]) {
                return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
            }
            return null;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        if (!mapRef.current) return;

        // Inject Leaflet CSS
        if (!document.getElementById("leaflet-css")) {
            const link = document.createElement("link");
            link.id   = "leaflet-css";
            link.rel  = "stylesheet";
            link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
            document.head.appendChild(link);
        }

        let map: any;

        import("leaflet").then(async (L) => {
            delete (L.Icon.Default.prototype as any)._getIconUrl;

            // Initialize map at default center while geocoding
            map = L.map(mapRef.current!, {
                center: [DEFAULT_LAT, DEFAULT_LNG],
                zoom: 13,
                zoomControl: false,
            });

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap",
                maxZoom: 19,
            }).addTo(map);

            L.control.zoom({ position: "bottomright" }).addTo(map);

            leafletRef.current = { map, L };

            // Geocode the address
            const result = await geocodeAddress(address);
            const pinLat = result?.lat ?? DEFAULT_LAT;
            const pinLng = result?.lng ?? DEFAULT_LNG;

            if (!result) setError(true);
            setCoords({ lat: pinLat, lng: pinLng });

            // Custom orange pin
            const icon = L.divIcon({
                html: `
                    <div style="
                        width:40px;height:40px;
                        background:linear-gradient(135deg,#EE7A40,#f59e5a);
                        border-radius:50% 50% 50% 0;
                        transform:rotate(-45deg);
                        border:3px solid white;
                        box-shadow:0 4px 16px rgba(238,122,64,0.55);
                        display:flex;align-items:center;justify-content:center;
                    ">
                        <div style="transform:rotate(45deg);width:11px;height:11px;background:white;border-radius:50%;"></div>
                    </div>
                `,
                className: "",
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -44],
            });

            const marker = L.marker([pinLat, pinLng], { icon }).addTo(map);

            // Popup with customer name + address
            marker.bindPopup(`
                <div style="font-family:system-ui;min-width:160px;">
                    ${customerName
                        ? `<p style="font-weight:700;font-size:13px;margin:0 0 4px">${customerName}</p>`
                        : ""}
                    <p style="font-size:11px;color:#666;margin:0;line-height:1.4">${address}</p>
                </div>
            `).openPopup();

            map.flyTo([pinLat, pinLng], result ? 15 : 13, { duration: 1 });
            setLoading(false);
        });

        return () => {
            map?.remove();
            leafletRef.current = null;
        };
    }, [address]);

    // Show user's own GPS location as a blue dot
    const handleShowMyLocation = () => {
        if (!navigator.geolocation || !leafletRef.current) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords: c }) => {
                const { map, L } = leafletRef.current;

                const myIcon = L.divIcon({
                    html: `
                        <div style="
                            width:16px;height:16px;
                            background:#3b82f6;
                            border-radius:50%;
                            border:3px solid white;
                            box-shadow:0 0 0 4px rgba(59,130,246,0.25);
                        "></div>
                    `,
                    className: "",
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                });

                L.marker([c.latitude, c.longitude], { icon: myIcon })
                    .addTo(map)
                    .bindPopup("<b style='font-size:12px'>Your location</b>")
                    .openPopup();

                // Fit both markers in view
                if (coords) {
                    const bounds = L.latLngBounds(
                        [c.latitude, c.longitude],
                        [coords.lat, coords.lng]
                    );
                    map.fitBounds(bounds, { padding: [60, 60] });
                } else {
                    map.flyTo([c.latitude, c.longitude], 15);
                }
                setLocating(false);
            },
            () => setLocating(false)
        );
    };

    // Open in Google Maps / OSM
    const openInMaps = () => {
        if (coords) {
            window.open(
                `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`,
                "_blank"
            );
        } else {
            window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
                "_blank"
            );
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
                style={{ height: "min(560px, 90vh)" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-[#EE7A40]" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900">
                                {customerName ? `${customerName}'s Location` : "Customer Location"}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate max-w-[320px]">{address}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Map */}
                <div className="relative flex-1 min-h-0">
                    <div ref={mapRef} className="w-full h-full" />

                    {/* Loading overlay */}
                    {loading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[1000]">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-6 h-6 text-[#EE7A40] animate-spin" />
                                <p className="text-xs text-gray-500 font-medium">Finding location…</p>
                            </div>
                        </div>
                    )}

                    {/* Geocoding warning */}
                    {!loading && error && (
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000]">
                            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-2 rounded-xl shadow-sm whitespace-nowrap">
                                ⚠ Exact location not found — showing approximate area
                            </div>
                        </div>
                    )}

                    {/* My location button */}
                    {!loading && (
                        <button
                            onClick={handleShowMyLocation}
                            disabled={locating}
                            className="absolute top-3 left-3 z-[1000] flex items-center gap-2 bg-white text-[#EE7A40] text-xs font-bold
                                       px-3 py-2 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.12)]
                                       hover:bg-orange-50 transition-colors disabled:opacity-60 border border-orange-100"
                        >
                            {locating
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <Navigation className="w-3.5 h-3.5" />
                            }
                            {locating ? "Locating…" : "Show my location"}
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3.5 border-t border-gray-100 shrink-0 bg-gray-50/50 flex items-center justify-between gap-3">
                    <p className="text-[11px] text-gray-400 leading-snug flex-1 min-w-0 truncate">
                        {address}
                    </p>
                    <button
                        onClick={openInMaps}
                        className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-[#EE7A40] hover:underline"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open in Google Maps
                    </button>
                </div>
            </div>
        </div>
    );
}
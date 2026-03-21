// Map module — Leaflet-based replacement for OpenLayers 2.x
import L from 'leaflet';

let map = null;
let marker = null;
let rt90Zone = null;
let sweref99Zone = null;

import markerIcon from './images/marker-icon.png';
import markerIcon2x from './images/marker-icon-2x.png';
import markerShadow from './images/marker-shadow.png';

const MARKER_ICON = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// RT90 zone bounds: [projection_key]: [south, west, north, east]
const RT90_ZONES = {
  rt90_7_5_gon_v: () => { const m = 11.0 + 18.375 / 60.0; return [[54.94, m - 1.125], [69.1, m + 1.125]]; },
  rt90_5_0_gon_v: () => { const m = 13.0 + 33.376 / 60.0; return [[54.94, m - 1.125], [69.1, m + 1.125]]; },
  rt90_2_5_gon_v: () => { const m = 15.0 + 48.0 / 60.0 + 22.624306 / 3600.0; return [[54.84, 10.7], [69.2, 24.45]]; },
  rt90_0_0_gon_v: () => { const m = 18.0 + 3.378 / 60.0; return [[54.94, m - 1.125], [69.1, m + 1.125]]; },
  rt90_2_5_gon_o: () => { const m = 20.0 + 18.378 / 60.0; return [[54.94, m - 1.125], [69.1, m + 1.125]]; },
  rt90_5_0_gon_o: () => { const m = 22.0 + 33.380 / 60.0; return [[54.94, m - 1.125], [69.1, 24.35]]; },
};

const SWEREF99_ZONES = {
  sweref_99_tm: () => [[54.94, 10.8], [69.1, 24.35]],
  sweref_99_1200: () => [[54.94, 12.0 - 1.1], [69.1, 12.0 + 0.75]],
  sweref_99_1330: () => [[54.94, 13.5 - 0.75], [69.1, 13.5 + 0.75]],
  sweref_99_1500: () => [[54.94, 15.0 - 0.75], [69.1, 15.0 + 0.75]],
  sweref_99_1630: () => [[54.94, 16.5 - 0.75], [69.1, 16.5 + 0.75]],
  sweref_99_1800: () => [[54.94, 18.0 - 0.75], [69.1, 18.0 + 0.75]],
  sweref_99_1415: () => [[54.94, 14.25 - 0.75], [69.1, 14.25 + 0.75]],
  sweref_99_1545: () => [[54.94, 15.75 - 0.75], [69.1, 15.75 + 0.75]],
  sweref_99_1715: () => [[54.94, 17.25 - 0.75], [69.1, 17.25 + 0.75]],
  sweref_99_1845: () => [[54.94, 18.75 - 0.75], [69.1, 18.75 + 0.75]],
  sweref_99_2015: () => [[54.94, 20.25 - 0.75], [69.1, 20.25 + 0.75]],
  sweref_99_2145: () => [[54.94, 21.75 - 0.75], [69.1, 21.75 + 0.75]],
  sweref_99_2315: () => [[54.94, 23.25 - 0.75], [69.1, 24.25]],
};

function normalizeKey(projection) {
  return projection.replace(/\./g, '_');
}

export function mapInit(onMapClick) {
  map = L.map('map', {
    center: [62.5, 15],
    zoom: 4,
    zoomControl: true,
  });

  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19,
  });

  const esriSatellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: '&copy; Esri', maxZoom: 18 }
  );

  const topoMap = L.tileLayer(
    'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; OpenTopoMap', maxZoom: 17 }
  );

  osm.addTo(map);

  L.control.layers({
    'OpenStreetMap': osm,
    'Satellit (Esri)': esriSatellite,
    'Topografisk': topoMap,
  }).addTo(map);

  L.control.scale({ metric: true, imperial: false }).addTo(map);

  map.on('click', (e) => {
    onMapClick(e.latlng.lat, e.latlng.lng);
  });
}

export function showMapMarker(lat, lon) {
  if (lat == null || lon == null) return;
  if (marker) {
    marker.setLatLng([lat, lon]);
  } else {
    marker = L.marker([lat, lon], { icon: MARKER_ICON }).addTo(map);
  }
  map.setView([lat, lon], map.getZoom());
}

export function showRt90Zone(projection) {
  if (rt90Zone) {
    map.removeLayer(rt90Zone);
    rt90Zone = null;
  }
  const key = normalizeKey(projection);
  const zoneFn = RT90_ZONES[key];
  if (!zoneFn) return;
  rt90Zone = L.rectangle(zoneFn(), {
    color: '#eab308',
    weight: 2,
    fill: false,
    interactive: false,
  }).addTo(map);
}

export function showSweref99Zone(projection) {
  if (sweref99Zone) {
    map.removeLayer(sweref99Zone);
    sweref99Zone = null;
  }
  const key = normalizeKey(projection);
  const zoneFn = SWEREF99_ZONES[key];
  if (!zoneFn) return;
  sweref99Zone = L.rectangle(zoneFn(), {
    color: '#ef4444',
    weight: 2,
    fill: false,
    interactive: false,
  }).addTo(map);
}

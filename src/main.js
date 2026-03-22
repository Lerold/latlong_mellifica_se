// Main application — coordinate converter
import 'leaflet/dist/leaflet.css';
import './styles.css';
import { mapInit, showMapMarker, showRt90Zone, showSweref99Zone } from './map.js';
import { swedishParams, geodeticToGrid, gridToGeodetic } from './geodesy/gauss-kruger.js';
import {
  convertLatFromDD, convertLongFromDD,
  convertLatFromDM, convertLongFromDM,
  convertLatFromDMS, convertLongFromDMS,
  convertLatToDD, convertLongToDD,
  convertLatToDM, convertLongToDM,
  convertLatToDMS, convertLongToDMS,
} from './geodesy/lat-lon.js';
import { shareInit, updateShareState } from './share.js';
import { initI18n, t } from './i18n.js';

// State
let latitude = null;
let longitude = null;

// DOM refs
const el = {};

function init() {
  // Cache DOM elements
  el.latDD = document.getElementById('lat_dd');
  el.latDM = document.getElementById('lat_dm');
  el.latDMS = document.getElementById('lat_dms');
  el.longDD = document.getElementById('long_dd');
  el.longDM = document.getElementById('long_dm');
  el.longDMS = document.getElementById('long_dms');
  el.projRt90 = document.getElementById('proj_rt90');
  el.xRt90 = document.getElementById('x_rt90');
  el.yRt90 = document.getElementById('y_rt90');
  el.projSweref99 = document.getElementById('proj_sweref99');
  el.nSweref99 = document.getElementById('n_sweref99');
  el.eSweref99 = document.getElementById('e_sweref99');
  el.infoButton = document.getElementById('info_button');

  // Init map
  mapInit((lat, lon) => setLatLong(lat, lon));

  // Zone overlays are shown only when the user changes projection

  // Init share feature
  shareInit();

  // Bind external map links
  bindExternalLinks();

  // Bind copy buttons
  bindCopyButtons();

  // Bind events — WGS84
  el.latDD.addEventListener('keyup', () => {
    latitude = convertLatFromDD(el.latDD.value);
    el.latDM.value = convertLatToDM(latitude);
    el.latDMS.value = convertLatToDMS(latitude);
    updateGrids();
  });
  el.longDD.addEventListener('keyup', () => {
    longitude = convertLongFromDD(el.longDD.value);
    el.longDM.value = convertLongToDM(longitude);
    el.longDMS.value = convertLongToDMS(longitude);
    updateGrids();
  });
  el.latDM.addEventListener('keyup', () => {
    latitude = convertLatFromDM(el.latDM.value);
    el.latDD.value = convertLatToDD(latitude);
    el.latDMS.value = convertLatToDMS(latitude);
    updateGrids();
  });
  el.longDM.addEventListener('keyup', () => {
    longitude = convertLongFromDM(el.longDM.value);
    el.longDD.value = convertLongToDD(longitude);
    el.longDMS.value = convertLongToDMS(longitude);
    updateGrids();
  });
  el.latDMS.addEventListener('keyup', () => {
    latitude = convertLatFromDMS(el.latDMS.value);
    el.latDD.value = convertLatToDD(latitude);
    el.latDM.value = convertLatToDM(latitude);
    updateGrids();
  });
  el.longDMS.addEventListener('keyup', () => {
    longitude = convertLongFromDMS(el.longDMS.value);
    el.longDD.value = convertLongToDD(longitude);
    el.longDM.value = convertLongToDM(longitude);
    updateGrids();
  });

  // Bind events — RT90
  el.xRt90.addEventListener('keyup', fromRt90);
  el.yRt90.addEventListener('keyup', fromRt90);
  el.projRt90.addEventListener('change', () => {
    showRt90Zone(el.projRt90.value);
    updateRt90();
  });

  // Bind events — SWEREF99
  el.nSweref99.addEventListener('keyup', fromSweref99);
  el.eSweref99.addEventListener('keyup', fromSweref99);
  el.projSweref99.addEventListener('change', () => {
    showSweref99Zone(el.projSweref99.value);
    updateSweref99();
  });

  // Info toggle
  el.infoButton.addEventListener('click', toggleInfo);

  // Init language switcher
  initI18n();

  // Parse URL parameters
  parseUrlArguments();
}

function setLatLong(lat, lon) {
  latitude = lat;
  longitude = lon;
  updateLatFields();
  updateLongFields();
  showMapMarker(lat, lon);
  updateRt90();
  updateSweref99();
  updateUrl();
  updateShareState(hasPosition());
  updateExternalLinks();
}

function updateGrids() {
  updateRt90();
  updateSweref99();
  showMapMarker(latitude, longitude);
  updateUrl();
  updateShareState(hasPosition());
  updateExternalLinks();
}

function hasPosition() {
  return latitude != null && longitude != null;
}

function fromRt90() {
  if (!el.xRt90.value || !el.yRt90.value) {
    latitude = null;
    longitude = null;
  } else {
    const x = parseFloat(el.xRt90.value.replace(',', '.'));
    const y = parseFloat(el.yRt90.value.replace(',', '.'));
    if (isNaN(x) || isNaN(y) || x < 6e6 || x > 8e6 || y < 1e6 || y > 2e6) {
      latitude = null;
      longitude = null;
    } else {
      swedishParams(el.projRt90.value);
      const latLon = gridToGeodetic(x, y);
      latitude = latLon[0];
      longitude = latLon[1];
    }
  }
  updateLatFields();
  updateLongFields();
  updateSweref99();
  showMapMarker(latitude, longitude);
  updateUrl();
  updateShareState(hasPosition());
}

function fromSweref99() {
  if (!el.nSweref99.value || !el.eSweref99.value) {
    latitude = null;
    longitude = null;
  } else {
    const n = parseFloat(el.nSweref99.value.replace(',', '.'));
    const e = parseFloat(el.eSweref99.value.replace(',', '.'));
    if (isNaN(n) || isNaN(e) || n < 6e6 || n > 8e6 || e < 1e5 || e > 1e6) {
      latitude = null;
      longitude = null;
    } else {
      swedishParams(el.projSweref99.value);
      const latLon = gridToGeodetic(n, e);
      latitude = latLon[0];
      longitude = latLon[1];
    }
  }
  updateLatFields();
  updateLongFields();
  updateRt90();
  showMapMarker(latitude, longitude);
  updateUrl();
  updateShareState(hasPosition());
}

function updateLatFields() {
  el.latDD.value = convertLatToDD(latitude);
  el.latDM.value = convertLatToDM(latitude);
  el.latDMS.value = convertLatToDMS(latitude);
}

function updateLongFields() {
  el.longDD.value = convertLongToDD(longitude);
  el.longDM.value = convertLongToDM(longitude);
  el.longDMS.value = convertLongToDMS(longitude);
}

function updateRt90() {
  if (hasPosition() && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude < 180) {
    swedishParams(el.projRt90.value);
    const xy = geodeticToGrid(latitude, longitude);
    el.xRt90.value = xy[0];
    el.yRt90.value = xy[1];
  } else {
    el.xRt90.value = '';
    el.yRt90.value = '';
  }
}

function updateSweref99() {
  if (hasPosition() && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude < 180) {
    swedishParams(el.projSweref99.value);
    const ne = geodeticToGrid(latitude, longitude);
    el.nSweref99.value = ne[0];
    el.eSweref99.value = ne[1];
  } else {
    el.nSweref99.value = '';
    el.eSweref99.value = '';
  }
}

// Update external map links
function updateExternalLinks() {
  const container = document.getElementById('external-maps');
  if (!hasPosition()) {
    container.hidden = true;
    return;
  }
  container.hidden = false;
}

function openExternal(url) {
  window.open(url, '_blank', 'noopener');
}

function getSweref99TmCoords() {
  const currentProj = el.projSweref99.value;
  swedishParams('sweref_99_tm');
  const ne = geodeticToGrid(latitude, longitude);
  swedishParams(currentProj);
  return { n: Math.round(ne[0]), e: Math.round(ne[1]) };
}

function bindExternalLinks() {
  document.getElementById('link-gmaps-view').addEventListener('click', () => {
    if (!hasPosition()) return;
    openExternal(`https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`);
  });
  document.getElementById('link-gmaps-nav').addEventListener('click', () => {
    if (!hasPosition()) return;
    openExternal(`https://www.google.com/maps/dir/?api=1&destination=${latitude.toFixed(6)},${longitude.toFixed(6)}`);
  });
  document.getElementById('link-eniro').addEventListener('click', () => {
    if (!hasPosition()) return;
    openExternal(`https://www.eniro.se/kartor?c=${latitude.toFixed(6)},${longitude.toFixed(6)}&z=13`);
  });
  document.getElementById('link-minkarta').addEventListener('click', () => {
    if (!hasPosition()) return;
    const tm = getSweref99TmCoords();
    openExternal(`https://minkarta.lantmateriet.se/plats/3006/v2.0/?e=${tm.e}&n=${tm.n}&z=6&mapprofile=karta&layers=%5B%5B%223%22%5D%2C%5B%221%22%5D%5D`);
  });
}

function bindCopyButtons() {
  document.querySelectorAll('.btn-copy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.copy;
      let text = '';
      if (type === 'dd') {
        text = `${el.latDD.value}, ${el.longDD.value}`;
      } else if (type === 'dm') {
        text = `${el.latDM.value}, ${el.longDM.value}`;
      } else if (type === 'dms') {
        text = `${el.latDMS.value}, ${el.longDMS.value}`;
      } else if (type === 'rt90') {
        text = `X: ${el.xRt90.value}, Y: ${el.yRt90.value}`;
      } else if (type === 'sweref99') {
        text = `N: ${el.nSweref99.value}, E: ${el.eSweref99.value}`;
      }
      if (!text || text.includes(', ') && text.split(', ').every(p => !p || p === 'X: ' || p === 'Y: ' || p === 'N: ' || p === 'E: ')) return;
      navigator.clipboard.writeText(text);
      btn.textContent = '\u2713';
      setTimeout(() => { btn.innerHTML = '&#x2398;'; }, 1500);
    });
  });
}

// Update the browser URL for sharing/bookmarking
function updateUrl() {
  if (!hasPosition()) return;
  const params = `latlong=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
  const newUrl = `${window.location.pathname}?${params}`;
  history.replaceState(null, '', newUrl);
}

// Info toggle
function toggleInfo() {
  const ids = ['wgs84_info', 'rt90_info', 'sweref99_info', 'map_info', 'about_info'];
  const showing = el.infoButton.textContent === t('info');
  ids.forEach((id) => {
    const elem = document.getElementById(id);
    if (elem) elem.hidden = !showing;
  });
  el.infoButton.textContent = showing ? t('hideInfo') : t('info');
}

// Parse URL parameters (?latlong=, ?rt90=, ?sweref99tm=)
function parseUrlArguments() {
  const params = location.search.substring(1);
  if (!params) return;

  const parts = params.split(/[=,]/);
  if (parts.length < 3 || !parts[1] || !parts[2]) return;

  const type = parts[0];
  const a = parseFloat(parts[1]);
  const b = parseFloat(parts[2]);
  if (isNaN(a) || isNaN(b)) return;

  if (type === 'latlong') {
    setLatLong(a, b);
  } else if (type === 'rt90') {
    swedishParams(el.projRt90.value);
    const latLon = gridToGeodetic(a, b);
    setLatLong(latLon[0], latLon[1]);
  } else if (type === 'sweref99tm') {
    swedishParams(el.projSweref99.value);
    const latLon = gridToGeodetic(a, b);
    setLatLong(latLon[0], latLon[1]);
  }
}

// Start
document.addEventListener('DOMContentLoaded', init);

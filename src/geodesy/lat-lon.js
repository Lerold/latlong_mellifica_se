// Author: Arnold Andreasson, info@mellifica.se
// Copyright (c) 2007-2016 Arnold Andreasson
// License: MIT License
//
// Converts latitude and longitude between DD, DM, and DMS formats.

// --- From input format ---

export function convertLatFromDD(value) {
  value = value.replace(/[N]/gi, 'N');
  value = value.replace(/[S]/gi, 'S');
  const result = value.match(/^\s*([NS\-+]?)\s*(\d{1,3})([.,]\d*)?\s*([NS]?)\s*$/);
  if (result == null) return null;

  let lat = parseFloat(result[2]);
  if (result[3] && result[3].replace(',', '.') !== '.') {
    lat += parseFloat(result[3].replace(',', '.'));
  }
  if (lat > 90) return null;
  if ((result[1] === 'S' || result[1] === '-') || result[4] === 'S') {
    lat *= -1;
  }
  if (Math.abs(lat) > 90) return null;
  return lat;
}

export function convertLongFromDD(value) {
  value = value.replace(/[Eö]/gi, 'E');
  value = value.replace(/[WV]/gi, 'W');
  const result = value.match(/^\s*([EW\-+]?)\s*(\d{1,3})([.,]\d*)?\s*([EW]?)\s*$/);
  if (result == null) return null;

  let lon = parseFloat(result[2]);
  if (result[3] && result[3].replace(',', '.') !== '.') {
    lon += parseFloat(result[3].replace(',', '.'));
  }
  if (lon > 180) return null;
  if ((result[1] === 'W' || result[1] === '-') || result[4] === 'W') {
    lon *= -1;
  }
  if (Math.abs(lon) > 180) return null;
  return lon;
}

export function convertLatFromDM(value) {
  value = value.replace(/[N]/gi, 'N');
  value = value.replace(/[S]/gi, 'S');
  const result = value.match(/^\s*([NS\-+]?)\s*(\d{1,3})\u00b0?\s*([0-5]?[0-9])?([.,]\d*)?'?\s*([NS]?)\s*$/);
  if (result == null) return null;

  let lat = parseFloat(result[2]);
  if (result[3]) lat += parseFloat(result[3]) / 60;
  if (result[4] && result[4].replace(',', '.') !== '.') {
    lat += parseFloat(result[4].replace(',', '.')) / 60;
  }
  if (lat > 90) return null;
  if ((result[1] === 'S' || result[1] === '-') || result[5] === 'S') {
    lat *= -1;
  }
  if (Math.abs(lat) > 90) return null;
  return lat;
}

export function convertLongFromDM(value) {
  value = value.replace(/[Eö]/gi, 'E');
  value = value.replace(/[WV]/gi, 'W');
  const result = value.match(/^\s*([EW\-+]?)\s*(\d{1,3})\u00b0?\s*([0-5]?[0-9])?([.,]\d*)?'?\s*([EW]?)\s*$/);
  if (result == null) return null;

  let lon = parseFloat(result[2]);
  if (result[3]) lon += parseFloat(result[3]) / 60;
  if (result[4] && result[4].replace(',', '.') !== '.') {
    lon += parseFloat(result[4].replace(',', '.')) / 60;
  }
  if (lon > 180) return null;
  if ((result[1] === 'W' || result[1] === '-') || result[5] === 'W') {
    lon *= -1;
  }
  if (Math.abs(lon) > 180) return null;
  return lon;
}

export function convertLatFromDMS(value) {
  value = value.replace(/[N]/gi, 'N');
  value = value.replace(/[S]/gi, 'S');
  const result = value.match(/^\s*([NS\-+]?)\s*(\d{1,3})\u00b0?\s*([0-5]?[0-9])?'?\s*([0-5]?[0-9])?([.,]\d*)?"?\s*([NS]?)\s*$/);
  if (result == null) return null;

  let lat = parseFloat(result[2]);
  if (result[3]) lat += parseFloat(result[3]) / 60;
  if (result[4]) lat += parseFloat(result[4]) / 3600;
  if (result[5] && result[5].replace(',', '.') !== '.') {
    lat += parseFloat(result[5].replace(',', '.')) / 3600;
  }
  if (lat > 90) return null;
  if ((result[1] === 'S' || result[1] === '-') || result[6] === 'S') {
    lat *= -1;
  }
  if (Math.abs(lat) > 90) return null;
  return lat;
}

export function convertLongFromDMS(value) {
  value = value.replace(/[Eö]/gi, 'E');
  value = value.replace(/[WV]/gi, 'W');
  const result = value.match(/^\s*([EW\-+]?)\s*(\d{1,3})\u00b0?\s*([0-5]?[0-9])?'?\s*([0-5]?[0-9])?([.,]\d*)?"?\s*([EW]?)\s*$/);
  if (result == null) return null;

  let lon = parseFloat(result[2]);
  if (result[3]) lon += parseFloat(result[3]) / 60;
  if (result[4]) lon += parseFloat(result[4]) / 3600;
  if (result[5] && result[5].replace(',', '.') !== '.') {
    lon += parseFloat(result[5].replace(',', '.')) / 3600;
  }
  if (lon > 180) return null;
  if ((result[1] === 'W' || result[1] === '-') || result[6] === 'W') {
    lon *= -1;
  }
  if (Math.abs(lon) > 180) return null;
  return lon;
}

// --- To display format ---

export function convertLatToDD(value) {
  if (value == null) return '';
  return value.toFixed(6);
}

export function convertLongToDD(value) {
  if (value == null) return '';
  return value.toFixed(6);
}

export function convertLatToDM(value) {
  if (value == null) return '';
  value += 0.0000008;
  const degrees = Math.floor(Math.abs(value));
  const minutes = (Math.abs(value) - degrees) * 60;
  const prefix = value >= 0 ? 'N' : 'S';
  return `${prefix} ${degrees}\u00b0 ${(Math.floor(minutes * 10000) / 10000).toFixed(4)}'`;
}

export function convertLongToDM(value) {
  if (value == null) return '';
  value += 0.0000008;
  const degrees = Math.floor(Math.abs(value));
  const minutes = (Math.abs(value) - degrees) * 60;
  const prefix = value >= 0 ? 'E' : 'W';
  return `${prefix} ${degrees}\u00b0 ${(Math.floor(minutes * 10000) / 10000).toFixed(4)}'`;
}

export function convertLatToDMS(value) {
  if (value == null) return '';
  value += 0.0000014;
  const degrees = Math.floor(Math.abs(value));
  const minutes = Math.floor((Math.abs(value) - degrees) * 60);
  const seconds = (Math.abs(value) - degrees - minutes / 60) * 3600;
  const prefix = value >= 0 ? 'N' : 'S';
  return `${prefix} ${degrees}\u00b0 ${minutes}' ${(Math.floor(seconds * 100) / 100).toFixed(2)}"`;
}

export function convertLongToDMS(value) {
  if (value == null) return '';
  value += 0.0000014;
  const degrees = Math.floor(Math.abs(value));
  const minutes = Math.floor((Math.abs(value) - degrees) * 60);
  const seconds = (Math.abs(value) - degrees - minutes / 60) * 3600;
  const prefix = value >= 0 ? 'E' : 'W';
  return `${prefix} ${degrees}\u00b0 ${minutes}' ${(Math.floor(seconds * 100) / 100).toFixed(2)}"`;
}

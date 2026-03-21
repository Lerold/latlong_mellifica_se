// Author: Arnold Andreasson, info@mellifica.se
// Copyright (c) 2007-2016 Arnold Andreasson
// License: MIT License
//
// Gauss Conformal Projection (Transverse Mercator), Krüger's Formulas.
// Parameters for SWEREF99 lat-long to/from RT90 and SWEREF99 coordinates.
// Source: http://www.lantmateriet.se/geodesi/

let axis = null;
let flattening = null;
let central_meridian = null;
let lat_of_origin = null;
let scale = null;
let false_northing = null;
let false_easting = null;

const PROJECTIONS = {
  // RT90 parameters, GRS 80 ellipsoid.
  rt90_7_5_gon_v: () => { grs80Params(); central_meridian = 11.0 + 18.375 / 60.0; scale = 1.000006; false_northing = -667.282; false_easting = 1500025.141; },
  rt90_5_0_gon_v: () => { grs80Params(); central_meridian = 13.0 + 33.376 / 60.0; scale = 1.0000058; false_northing = -667.130; false_easting = 1500044.695; },
  rt90_2_5_gon_v: () => { grs80Params(); central_meridian = 15.0 + 48.0 / 60.0 + 22.624306 / 3600.0; scale = 1.00000561024; false_northing = -667.711; false_easting = 1500064.274; },
  rt90_0_0_gon_v: () => { grs80Params(); central_meridian = 18.0 + 3.378 / 60.0; scale = 1.0000054; false_northing = -668.844; false_easting = 1500083.521; },
  rt90_2_5_gon_o: () => { grs80Params(); central_meridian = 20.0 + 18.379 / 60.0; scale = 1.0000052; false_northing = -670.706; false_easting = 1500102.765; },
  rt90_5_0_gon_o: () => { grs80Params(); central_meridian = 22.0 + 33.380 / 60.0; scale = 1.0000049; false_northing = -672.557; false_easting = 1500121.846; },

  // SWEREF99TM and SWEREF99ddmm parameters.
  sweref_99_tm: () => { sweref99Params(); central_meridian = 15.0; lat_of_origin = 0.0; scale = 0.9996; false_northing = 0.0; false_easting = 500000.0; },
  sweref_99_1200: () => { sweref99Params(); central_meridian = 12.0; },
  sweref_99_1330: () => { sweref99Params(); central_meridian = 13.5; },
  sweref_99_1500: () => { sweref99Params(); central_meridian = 15.0; },
  sweref_99_1630: () => { sweref99Params(); central_meridian = 16.5; },
  sweref_99_1800: () => { sweref99Params(); central_meridian = 18.0; },
  sweref_99_1415: () => { sweref99Params(); central_meridian = 14.25; },
  sweref_99_1545: () => { sweref99Params(); central_meridian = 15.75; },
  sweref_99_1715: () => { sweref99Params(); central_meridian = 17.25; },
  sweref_99_1845: () => { sweref99Params(); central_meridian = 18.75; },
  sweref_99_2015: () => { sweref99Params(); central_meridian = 20.25; },
  sweref_99_2145: () => { sweref99Params(); central_meridian = 21.75; },
  sweref_99_2315: () => { sweref99Params(); central_meridian = 23.25; },
};

function grs80Params() {
  axis = 6378137.0;
  flattening = 1.0 / 298.257222101;
  central_meridian = null;
  lat_of_origin = 0.0;
}

function sweref99Params() {
  axis = 6378137.0;
  flattening = 1.0 / 298.257222101;
  central_meridian = null;
  lat_of_origin = 0.0;
  scale = 1.0;
  false_northing = 0.0;
  false_easting = 150000.0;
}

// Map old key format (with dots) to new format (with underscores)
function normalizeKey(projection) {
  return projection.replace(/\./g, '_');
}

export function swedishParams(projection) {
  const key = normalizeKey(projection);
  const setup = PROJECTIONS[key];
  if (setup) {
    setup();
  } else {
    central_meridian = null;
  }
}

export function geodeticToGrid(latitude, longitude) {
  const xy = [null, null];
  if (central_meridian == null) return xy;

  const e2 = flattening * (2.0 - flattening);
  const n = flattening / (2.0 - flattening);
  const a_roof = axis / (1.0 + n) * (1.0 + n * n / 4.0 + n * n * n * n / 64.0);
  const A = e2;
  const B = (5.0 * e2 * e2 - e2 * e2 * e2) / 6.0;
  const C = (104.0 * e2 * e2 * e2 - 45.0 * e2 * e2 * e2 * e2) / 120.0;
  const D = (1237.0 * e2 * e2 * e2 * e2) / 1260.0;
  const beta1 = n / 2.0 - 2.0 * n * n / 3.0 + 5.0 * n * n * n / 16.0 + 41.0 * n * n * n * n / 180.0;
  const beta2 = 13.0 * n * n / 48.0 - 3.0 * n * n * n / 5.0 + 557.0 * n * n * n * n / 1440.0;
  const beta3 = 61.0 * n * n * n / 240.0 - 103.0 * n * n * n * n / 140.0;
  const beta4 = 49561.0 * n * n * n * n / 161280.0;

  const deg_to_rad = Math.PI / 180.0;
  const phi = latitude * deg_to_rad;
  const lambda = longitude * deg_to_rad;
  const lambda_zero = central_meridian * deg_to_rad;

  const phi_star = phi - Math.sin(phi) * Math.cos(phi) * (A +
    B * Math.pow(Math.sin(phi), 2) +
    C * Math.pow(Math.sin(phi), 4) +
    D * Math.pow(Math.sin(phi), 6));
  const delta_lambda = lambda - lambda_zero;
  const xi_prim = Math.atan(Math.tan(phi_star) / Math.cos(delta_lambda));
  const eta_prim = Math.atanh(Math.cos(phi_star) * Math.sin(delta_lambda));

  const x = scale * a_roof * (xi_prim +
    beta1 * Math.sin(2.0 * xi_prim) * Math.cosh(2.0 * eta_prim) +
    beta2 * Math.sin(4.0 * xi_prim) * Math.cosh(4.0 * eta_prim) +
    beta3 * Math.sin(6.0 * xi_prim) * Math.cosh(6.0 * eta_prim) +
    beta4 * Math.sin(8.0 * xi_prim) * Math.cosh(8.0 * eta_prim)) +
    false_northing;
  const y = scale * a_roof * (eta_prim +
    beta1 * Math.cos(2.0 * xi_prim) * Math.sinh(2.0 * eta_prim) +
    beta2 * Math.cos(4.0 * xi_prim) * Math.sinh(4.0 * eta_prim) +
    beta3 * Math.cos(6.0 * xi_prim) * Math.sinh(6.0 * eta_prim) +
    beta4 * Math.cos(8.0 * xi_prim) * Math.sinh(8.0 * eta_prim)) +
    false_easting;

  xy[0] = Math.round(x * 1000.0) / 1000.0;
  xy[1] = Math.round(y * 1000.0) / 1000.0;
  return xy;
}

export function gridToGeodetic(x, y) {
  const latLon = [null, null];
  if (central_meridian == null) return latLon;

  const e2 = flattening * (2.0 - flattening);
  const n = flattening / (2.0 - flattening);
  const a_roof = axis / (1.0 + n) * (1.0 + n * n / 4.0 + n * n * n * n / 64.0);
  const delta1 = n / 2.0 - 2.0 * n * n / 3.0 + 37.0 * n * n * n / 96.0 - n * n * n * n / 360.0;
  const delta2 = n * n / 48.0 + n * n * n / 15.0 - 437.0 * n * n * n * n / 1440.0;
  const delta3 = 17.0 * n * n * n / 480.0 - 37 * n * n * n * n / 840.0;
  const delta4 = 4397.0 * n * n * n * n / 161280.0;

  const Astar = e2 + e2 * e2 + e2 * e2 * e2 + e2 * e2 * e2 * e2;
  const Bstar = -(7.0 * e2 * e2 + 17.0 * e2 * e2 * e2 + 30.0 * e2 * e2 * e2 * e2) / 6.0;
  const Cstar = (224.0 * e2 * e2 * e2 + 889.0 * e2 * e2 * e2 * e2) / 120.0;
  const Dstar = -(4279.0 * e2 * e2 * e2 * e2) / 1260.0;

  const deg_to_rad = Math.PI / 180;
  const lambda_zero = central_meridian * deg_to_rad;
  const xi = (x - false_northing) / (scale * a_roof);
  const eta = (y - false_easting) / (scale * a_roof);
  const xi_prim = xi -
    delta1 * Math.sin(2.0 * xi) * Math.cosh(2.0 * eta) -
    delta2 * Math.sin(4.0 * xi) * Math.cosh(4.0 * eta) -
    delta3 * Math.sin(6.0 * xi) * Math.cosh(6.0 * eta) -
    delta4 * Math.sin(8.0 * xi) * Math.cosh(8.0 * eta);
  const eta_prim = eta -
    delta1 * Math.cos(2.0 * xi) * Math.sinh(2.0 * eta) -
    delta2 * Math.cos(4.0 * xi) * Math.sinh(4.0 * eta) -
    delta3 * Math.cos(6.0 * xi) * Math.sinh(6.0 * eta) -
    delta4 * Math.cos(8.0 * xi) * Math.sinh(8.0 * eta);
  const phi_star = Math.asin(Math.sin(xi_prim) / Math.cosh(eta_prim));
  const delta_lambda = Math.atan(Math.sinh(eta_prim) / Math.cos(xi_prim));
  const lon_radian = lambda_zero + delta_lambda;
  const lat_radian = phi_star + Math.sin(phi_star) * Math.cos(phi_star) *
    (Astar +
      Bstar * Math.pow(Math.sin(phi_star), 2) +
      Cstar * Math.pow(Math.sin(phi_star), 4) +
      Dstar * Math.pow(Math.sin(phi_star), 6));

  latLon[0] = lat_radian * 180.0 / Math.PI;
  latLon[1] = lon_radian * 180.0 / Math.PI;
  return latLon;
}

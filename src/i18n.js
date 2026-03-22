const translations = {
  sv: {
    pageTitle: import.meta.env.VITE_SITE_NAME + ' — Konvertering SWEREF99/RT90/WGS84',
    tableConversion: 'tabellkonvertering',
    info: 'info',
    hideInfo: 'dölj info',
    latitude: 'Latitud',
    longitude: 'Longitud',
    degrees: 'Grader:',
    degMin: 'Grad/min:',
    degMinSec: 'Grad/min/sek:',
    copy: 'Kopiera',
    projection: 'Kartprojektion:',
    national: 'Nationell',
    sharePosition: 'Dela position',
    eniroMaps: 'Eniro Kartor',
    wgs84Info1: 'Mata in latitud/longitud i något av fälten ovan. De flesta format ska accepteras, exempelvis latitud: 58 52 30.0, longitud: 11 8 45.0 i fälten för Grad/min/sek. Övriga fält på sidan uppdateras automatiskt.',
    wgs84Info2: 'SWEREF 99 och WGS 84 är två olika referenssystem men likheterna är stora och avvikelsen mellan systemen ligger på decimeternivå.',
    rt90Info1: 'Välj projektion och mata in X och Y. Övriga fält på sidan uppdateras automatiskt. Heltalsdelen av X och Y ska vara 7 siffror lång och enheten är meter.',
    rt90Info2: 'RT 90 och SWEREF 99 är två olika referenssystem. Transformationen sker med Lantmäteriets direktprojektionssamband.',
    sweref99Info: 'Välj projektion och mata in N och E. Övriga fält på sidan uppdateras automatiskt. Heltalsdelen av N ska vara 7 siffror lång och E ska vara 6 siffror. Enheten är meter.',
    aboutLinks: 'Direktlänkar:',
    aboutLinksText: 'Det går att ha direktlänkar till en position. Använd knappen "Dela position" ovanför kartan, eller kopiera webbadressen direkt från webbläsaren.',
    aboutFormulas: 'Alla formler och parametrar är hämtade från Lantmäteriets webbsidor:',
    mapInfo: 'Klicka/tryck på kartan för att se en positions koordinater uttryckt i lat/long, RT 90 och SWEREF 99.',
    copyrightOsm: 'OpenStreetMap-bidragsgivare',
  },
  en: {
    pageTitle: import.meta.env.VITE_SITE_NAME + ' — Conversion SWEREF99/RT90/WGS84',
    tableConversion: 'table conversion',
    info: 'info',
    hideInfo: 'hide info',
    latitude: 'Latitude',
    longitude: 'Longitude',
    degrees: 'Degrees:',
    degMin: 'Deg/min:',
    degMinSec: 'Deg/min/sec:',
    copy: 'Copy',
    projection: 'Map projection:',
    national: 'National',
    sharePosition: 'Share position',
    eniroMaps: 'Eniro Maps',
    wgs84Info1: 'Enter latitude/longitude in any of the fields above. Most formats are accepted, e.g. latitude: 58 52 30.0, longitude: 11 8 45.0 in the Deg/min/sec fields. Other fields on the page update automatically.',
    wgs84Info2: 'SWEREF 99 and WGS 84 are two different reference systems but the similarities are large and the deviation is at the decimetre level.',
    rt90Info1: 'Select projection and enter X and Y. Other fields on the page update automatically. The integer part of X and Y should be 7 digits long and the unit is metres.',
    rt90Info2: 'RT 90 and SWEREF 99 are two different reference systems. The transformation uses Lantmäteriet\'s direct projection parameters.',
    sweref99Info: 'Select projection and enter N and E. Other fields on the page update automatically. The integer part of N should be 7 digits long and E should be 6 digits. The unit is metres.',
    aboutLinks: 'Direct links:',
    aboutLinksText: 'You can create direct links to a position. Use the "Share position" button above the map, or copy the URL directly from the browser.',
    aboutFormulas: 'All formulas and parameters are from Lantmäteriet\'s website:',
    mapInfo: 'Click/tap on the map to see a position\'s coordinates expressed in lat/lon, RT 90 and SWEREF 99.',
    copyrightOsm: 'OpenStreetMap contributors',
  },
};

let currentLang = localStorage.getItem('lang') || 'sv';

export function t(key) {
  return translations[currentLang]?.[key] || translations.sv[key] || key;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
}

export function initI18n() {
  document.getElementById('lang-sv').addEventListener('click', () => setLang('sv'));
  document.getElementById('lang-en').addEventListener('click', () => setLang('en'));
  setLang(currentLang);
}

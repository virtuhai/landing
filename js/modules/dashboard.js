/**
 * dashboard.js — Stage 8: browser-only live environmental data.
 * Open-Meteo needs no API key. Kyiv is the starting demonstration location;
 * a future location picker can pass different coordinates to loadDashboard.
 */

const KYIV = { latitude: 50.4501, longitude: 30.5234 };

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

function setText(root, selector, value) {
  const element = root.querySelector(selector);
  if (element) element.textContent = value;
}

function weatherLabel(code) {
  if ([95, 96, 99].includes(code)) return 'Thunderstorms possible';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain or showers';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow conditions';
  if ([1, 2, 3].includes(code)) return 'Partly cloudy';
  return 'Clear conditions';
}

function uvLabel(value) {
  if (value < 3) return 'Low exposure';
  if (value < 6) return 'Moderate exposure';
  if (value < 8) return 'High exposure';
  return 'Very high exposure';
}

function lightningLabel(code) {
  return [95, 96, 99].includes(code)
    ? 'Elevated thunderstorm signal'
    : 'No thunderstorm signal detected';
}

function updatedLabel() {
  return `Updated ${new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Kyiv'
  }).format(new Date())} Kyiv time`;
}

async function fetchLiveData() {
  const parameters = new URLSearchParams({
    latitude: String(KYIV.latitude),
    longitude: String(KYIV.longitude),
    timezone: 'auto'
  });

  const weatherParameters = new URLSearchParams(parameters);
  weatherParameters.set('current', 'temperature_2m,weather_code');
  weatherParameters.set('daily', 'uv_index_max');

  const airParameters = new URLSearchParams(parameters);
  airParameters.set('current', 'us_aqi,pm2_5');

  const [weatherResponse, airResponse] = await Promise.all([
    fetch(`${WEATHER_URL}?${weatherParameters}`),
    fetch(`${AIR_QUALITY_URL}?${airParameters}`)
  ]);

  if (!weatherResponse.ok || !airResponse.ok) throw new Error('Live data service unavailable');
  return Promise.all([weatherResponse.json(), airResponse.json()]);
}

async function loadDashboard(root, refreshButton) {
  refreshButton?.classList.add('is-loading');
  refreshButton?.setAttribute('aria-busy', 'true');
  setText(root, '[data-dashboard-updated]', 'Refreshing live sources…');

  try {
    const [weather, air] = await fetchLiveData();
    const temperature = Math.round(weather.current.temperature_2m);
    const weatherCode = weather.current.weather_code;
    const uv = Math.round(weather.daily.uv_index_max[0] * 10) / 10;
    const aqi = Math.round(air.current.us_aqi);
    const pm25 = Math.round(air.current.pm2_5 * 10) / 10;

    setText(root, '[data-dashboard-temperature]', String(temperature));
    setText(root, '[data-dashboard-weather]', weatherLabel(weatherCode));
    setText(root, '[data-dashboard-aqi]', String(aqi));
    setText(root, '[data-dashboard-pm]', `PM2.5: ${pm25} μg/m³`);
    setText(root, '[data-dashboard-uv]', String(uv));
    setText(root, '[data-dashboard-uv-label]', uvLabel(uv));
    setText(root, '[data-dashboard-lightning]', lightningLabel(weatherCode));
    setText(root, '[data-dashboard-status]', 'Live data connected');
    setText(root, '[data-dashboard-updated]', updatedLabel());
  } catch (error) {
    setText(root, '[data-dashboard-weather]', 'Live source unavailable');
    setText(root, '[data-dashboard-uv-label]', 'Live source unavailable');
    setText(root, '[data-dashboard-lightning]', 'Live source unavailable');
    setText(root, '[data-dashboard-status]', 'Source unavailable');
    setText(root, '[data-dashboard-updated]', 'Unable to refresh live sources');
  } finally {
    refreshButton?.classList.remove('is-loading');
    refreshButton?.removeAttribute('aria-busy');
  }
}

/** Initialise every standalone dashboard block on the page. */
export function initDashboard() {
  document.querySelectorAll('[data-dashboard]').forEach((root) => {
    const refreshButton = root.querySelector('[data-dashboard-refresh]');
    refreshButton?.addEventListener('click', () => loadDashboard(root, refreshButton));
    loadDashboard(root, refreshButton);
  });
}

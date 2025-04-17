const apiKey = 'YOUR_API_KEY'; // 🔐 Don't upload with this key

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const themeToggle = document.getElementById('themeToggle');
const errorMsg = document.getElementById('errorMsg');

// Theme toggle
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Search
searchBtn.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (!city) {
    errorMsg.textContent = 'Please enter a city name.';
    return;
  }

  errorMsg.textContent = 'Loading...';
  currentWeather.innerHTML = '';
  forecast.innerHTML = '';

  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!weatherRes.ok || !forecastRes.ok) throw new Error('City not found');

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    showCurrentWeather(weatherData);
    showForecast(forecastData.list);

    errorMsg.textContent = '';
  } catch (err) {
    errorMsg.textContent = 'City not found or API error.';
  }
});

// Display current weather
function showCurrentWeather(data) {
  const tempC = data.main.temp;
  const tempF = (tempC * 9/5 + 32).toFixed(2);
  const html = `
    <h3>${data.name}</h3>
    <p>Temperature: ${tempC}°C / ${tempF}°F</p>
    <p>Condition: ${data.weather[0].main}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind: ${data.wind.speed} m/s</p>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon" />
  `;
  currentWeather.innerHTML = html;
}

// Display 5-day forecast
function showForecast(list) {
  const daily = {};

  list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!daily[date] && item.dt_txt.includes('12:00:00')) {
      daily[date] = item;
    }
  });

  let count = 0;
  for (const day in daily) {
    if (count >= 5) break;
    const item = daily[day];
    const tempC = item.main.temp;
    const icon = item.weather[0].icon;
    forecast.innerHTML += `
      <div class="card">
        <h4>${day}</h4>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather icon" />
        <p>${tempC}°C</p>
        <p>${item.weather[0].main}</p>
      </div>
    `;
    count++;
  }
}

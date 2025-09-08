// === OpenWeather väder-widget ===
const API_KEY = "1d8d543bd9d139bb3faa7b7280d10fad"; // din nyckel
const CITY = "Linköping"; // ändra om du vill visa annan stad

async function getWeather() {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(CITY)}&appid=${API_KEY}&units=metric&lang=se`
    );

    if (!res.ok) {
      throw new Error(`API-svar fel: ${res.status}`);
    }

    const data = await res.json();
    const weather = data.weather[0];
    const temp = Math.round(data.main.temp);

    const card = document.getElementById("weatherCard");
    card.innerHTML = `
      <h3>Vädret i ${data.name}</h3>
      <p>${weather.description}</p>
      <p>🌡️ ${temp} °C</p>
      <img src="https://openweathermap.org/img/wn/${weather.icon}@2x.png"
           alt="${weather.description}" />
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("weatherCard").innerHTML =
      "<p>Kunde inte ladda väder just nu.</p>";
  }
}

// kör direkt när sidan laddas
getWeather();

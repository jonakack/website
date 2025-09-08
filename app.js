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

// === Like-knapp logik ===
document.addEventListener('DOMContentLoaded', () => {
  // Like button logic
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const counter = this.querySelector('.counter');
      const icon = this.querySelector('i');
      let count = parseInt(counter.textContent, 10) || 0;

      if (this.classList.contains('liked')) {
        // Unlike
        count = Math.max(0, count - 1);
        counter.textContent = count;
        this.classList.remove('liked');
        icon.classList.remove('fa-solid', 'fa-heart', 'liked-heart');
        icon.classList.add('fa-regular', 'fa-heart');
      } else {
        // Like
        count++;
        counter.textContent = count;
        this.classList.add('liked');
        icon.classList.add('fa-solid', 'fa-heart', 'liked-heart');
        icon.classList.remove('fa-regular');
      }
    });
  });
});
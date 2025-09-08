// ===========================
// TechTeam Collective App.js
// ===========================

// === 1. Theme Toggle (Dark/Light mode) ===
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");
    if (currentTheme === "dark") {
      root.setAttribute("data-theme", "light");
      themeToggle.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    } else {
      root.setAttribute("data-theme", "dark");
      themeToggle.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    }
  });
}

// === 2. Mobilmeny (hamburger) ===
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("show");
    menuToggle.classList.toggle("active");
  });
}

// === 3. Like Buttons för medlemmar ===
const likeButtons = document.querySelectorAll(".like-btn");

likeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("liked");
    const counter = btn.querySelector(".counter");
    let count = parseInt(counter.textContent, 10);

    if (btn.classList.contains("liked")) {
      counter.textContent = count + 1;
      btn.innerHTML = `<i class="fa-solid fa-heart"></i> <span class="counter">${count + 1}</span>`;
    } else {
      counter.textContent = count - 1;
      btn.innerHTML = `<i class="fa-regular fa-heart"></i> <span class="counter">${count - 1}</span>`;
    }
  });
});

// === 4. Röstningsformulär ===
const voteForm = document.getElementById("voteForm");
const voteSelect = document.getElementById("teamOption");
const voteResult = document.getElementById("voteResult");

if (voteForm) {
  voteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedOption = voteSelect.value;

    if (!selectedOption) {
      voteResult.textContent = "Vänligen välj ett namn innan du röstar.";
      voteResult.className = "vote-result error";
      return;
    }

    voteResult.textContent = `Tack! Din röst på "${selectedOption}" är registrerad.`;
    voteResult.className = "vote-result success";

    // Reset form after submission
    voteForm.reset();
  });
}

// === 5. Bildkarusell ===
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".carousel-prev");
const nextBtn = document.querySelector(".carousel-next");
const dotsContainer = document.querySelector(".carousel-dots");
let currentSlide = 0;

if (slides.length > 0) {
  // Skapa prickar dynamiskt
  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("carousel-dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".carousel-dot");

  function goToSlide(n) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - n)}%)`;
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === n);
    });

    currentSlide = n;
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
  }

  function prevSlideFunc() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(currentSlide);
  }

  goToSlide(0);

  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlideFunc);

  // Auto-slide var 6:e sekund
  setInterval(nextSlide, 6000);
}

// === 6. Kontaktformulär ===
const contactForm = document.getElementById("contactForm");
const contactResult = document.getElementById("contactResult");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const messageInput = document.getElementById("messageInput");

    if (!nameInput.value || nameInput.value.trim().length < 2) {
      contactResult.textContent = "Vänligen ange ett giltigt namn.";
      contactResult.className = "contact-result error";
      return;
    }

    contactResult.textContent = "Tack! Vi återkommer till dig snart.";
    contactResult.className = "contact-result success";

    contactForm.reset();
  });
}

// === 7. Scroll-to-top knapp ===
const scrollTopBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopBtn.style.display = "flex";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// === 8. Väderwidget ===
const weatherCard = document.getElementById("weatherCard");

if (weatherCard) {
  const API_KEY = "1d8d543bd9d139bb3faa7b7280d10fad"; // Din OpenWeather API-nyckel
  const CITY = "Linköping"; // Ändra stad här om du vill
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&lang=se&appid=${API_KEY}`;

  async function fetchWeather() {
    try {
      // Försök hämta cache från localStorage först
      const cached = localStorage.getItem("weatherData");
      const cachedTime = localStorage.getItem("weatherTimestamp");

      if (cached && cachedTime && Date.now() - cachedTime < 30 * 60 * 1000) {
        renderWeather(JSON.parse(cached));
        return;
      }

      // Hämta data från API
      const response = await fetch(URL);
      if (!response.ok) throw new Error("Kunde inte hämta väderdata");

      const data = await response.json();

      // Cachea svaret i 30 min
      localStorage.setItem("weatherData", JSON.stringify(data));
      localStorage.setItem("weatherTimestamp", Date.now());

      renderWeather(data);
    } catch (error) {
      weatherCard.innerHTML = `
        <div class="weather-main">
          <p class="error">⚠️ Kunde inte hämta väderdata. Försök igen senare.</p>
        </div>`;
    }
  }

  function renderWeather(data) {
    weatherCard.innerHTML = `
      <div class="weather-main">
        <div class="weather-header">
          <img class="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Väderikon">
          <div class="weather-info">
            <h4>${data.name}</h4>
            <p class="weather-temp">${Math.round(data.main.temp)}°C</p>
          </div>
        </div>
        <p class="weather-desc">${data.weather[0].description}</p>
        <div class="weather-details">
          <div class="weather-detail">
            <i class="fas fa-wind"></i>${data.wind.speed} m/s
          </div>
          <div class="weather-detail">
            <i class="fas fa-tint"></i>${data.main.humidity}%
          </div>
        </div>
      </div>
    `;
  }

  // Kör första gången
  fetchWeather();
}


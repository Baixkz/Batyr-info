// 1. FIREBASE КОНФИГУРАЦИЯСЫ
const firebaseConfig = {
  apiKey: "AIzaSyCaIwrxsSc4s4SV_sIfOwcGaeB6obdpuzE",
  authDomain: "batyr-final.firebaseapp.com",
  projectId: "batyr-final",
  storageBucket: "batyr-final.firebasestorage.app",
  messagingSenderId: "621519255228",
  appId: "1:621519255228:web:6087e026a6db84afa2c2b9",
  measurementId: "G-73YT8RDF4W"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 2. АУА РАЙЫ (Aktau)
async function getWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.65&longitude=51.17&current_weather=true');
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        const el = document.getElementById('weatherText');
        if(el) el.innerHTML = `<i class="fas fa-temperature-high"></i> ${temp}°C`;
    } catch (e) { console.log("Ауа райы қатесі:", e); }
}

// 3. НАМАЗ УАҚЫТЫ (Aktau)
async function getPrayerTimes() {
    try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Aktau&country=Kazakhstan&method=2');
        const data = await res.json();
        const t = data.data.timings;
        const el = document.getElementById('prayerText');
        if(el) el.innerHTML = `<i class="fas fa-mosque"></i> Бесін: ${t.Dhuhr}`;
    } catch (e) { console.log("Намаз уақыты қатесі:", e); }
}

// 4. БАСТЫ БЕТТЕГІ ІЗДЕУ (index.html)
function searchCards() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.getElementsByClassName('card');
    for (let card of cards) {
        let text = card.innerText.toLowerCase();
        card.style.display = text.includes(input) ? "flex" : "none";
    }
}

// 5. SERVICE WORKER ТІРКЕУ (PWA үшін)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker тіркелді!'))
      .catch(err => console.log('SW қатесі:', err));
  });
}

// 6. БЕТ ЖҮКТЕЛГЕНДЕ ОРТАҚ ФУНКЦИЯЛАРДЫ ҚОСУ
document.addEventListener('DOMContentLoaded', () => {
    getWeather();
    getPrayerTimes();
    
    // Іздеу жолағы болса, оған тыңдаушы қосу
    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        searchInput.addEventListener('keyup', searchCards);
    }
});

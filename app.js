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

// 2. БАСТЫ БЕТКЕ КАТЕГОРИЯЛАРДЫ БАЗАДАН ШЫҒАРУ (ЖАҢА ЖҮЙЕ)
function loadHomeCategories() {
    const grid = document.getElementById('categoryGrid');
    if (!grid) return; // Егер басты бет болмаса, тоқтату

    // Тек parentId-і "root" (басты) болатындарды аламыз
    db.collection("categories")
      .where("parentId", "==", "root")
      .onSnapshot(snap => {
        grid.innerHTML = "";
        if (snap.empty) {
            grid.innerHTML = "<p style='grid-column: 1/-1; text-align:center; padding:20px; color:#999;'>Админ панельден категория қосыңыз...</p>";
            return;
        }
        snap.forEach(doc => {
            const cat = doc.data();
            grid.innerHTML += `
                <div class="card" onclick="location.href='category.html?id=${doc.id}&name=${encodeURIComponent(cat.name)}'">
                    <i class="fas ${cat.icon || 'fa-th-large'}" style="font-size: 24px; color: #007aff; margin-bottom: 8px;"></i>
                    <span style="font-size: 13px; font-weight: 600; text-align: center;">${cat.name}</span>
                </div>`;
        });
    }, err => console.log("Категория жүктеу қатесі:", err));
}

// 3. АУА РАЙЫ (Aktau)
async function getWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.65&longitude=51.17&current_weather=true');
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        const el = document.getElementById('weatherText');
        if(el) el.innerHTML = `<i class="fas fa-temperature-high"></i> ${temp}°C`;
    } catch (e) { console.log("Ауа райы қатесі:", e); }
}

// 4. НАМАЗ УАҚЫТЫ (Aktau)
async function getPrayerTimes() {
    try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Aktau&country=Kazakhstan&method=2');
        const data = await res.json();
        const t = data.data.timings;
        const el = document.getElementById('prayerText');
        if(el) el.innerHTML = `<i class="fas fa-mosque"></i> Бесін: ${t.Dhuhr}`;
    } catch (e) { console.log("Намаз уақыты қатесі:", e); }
}

// 5. ІЗДЕУ ЛОГИКАСЫ
function searchCards() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.getElementsByClassName('card');
    for (let card of cards) {
        let text = card.innerText.toLowerCase();
        card.style.display = text.includes(input) ? "flex" : "none";
    }
}

// 6. БЕТ ЖҮКТЕЛГЕНДЕ ІСКЕ ҚОСУ
document.addEventListener('DOMContentLoaded', () => {
    getWeather();
    getPrayerTimes();
    loadHomeCategories(); // Басты бетті толтыру
    
    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        searchInput.addEventListener('keyup', searchCards);
    }
});

// 7. SERVICE WORKER ТІРКЕУ
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW тіркелді!'))
      .catch(err => console.log('SW қатесі:', err));
  });
}

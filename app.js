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

// 2. АВТОМАТТЫ ИКОНКА ТАҢДАУ ЛОГИКАСЫ
function getAutoIcon(name) {
    const n = name.toLowerCase();
    if (n.includes('такси') || n.includes('көлік')) return 'fa-taxi';
    if (n.includes('дүкен') || n.includes('маркет') || n.includes('сауда')) return 'fa-shopping-bag';
    if (n.includes('жұмыс')) return 'fa-briefcase';
    if (n.includes('тамақ') || n.includes('асхана') || n.includes('дәмхана')) return 'fa-utensils';
    if (n.includes('мед') || n.includes('дәріхана') || n.includes('емхана')) return 'fa-hospital';
    if (n.includes('мал') || n.includes('сиыр') || n.includes('қой')) return 'fa-cow';
    if (n.includes('ет')) return 'fa-drumstick-bite';
    if (n.includes('үй') || n.includes('жер') || n.includes('пәтер')) return 'fa-house-chimney';
    if (n.includes('телефон') || n.includes('ұялы')) return 'fa-mobile-alt';
    if (n.includes('киім')) return 'fa-tshirt';
    if (n.includes('құрылыс') || n.includes('цемент')) return 'fa-screwdriver-wrench';
    return 'fa-folder'; // Ештеңе табылмаса
}

// 3. КАТЕГОРИЯЛАРДЫ БЕТТЕРГЕ БӨЛІП ЖҮКТЕУ (Home, Market, Other)
function loadPageCategories(pageName, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    db.collection("categories")
      .where("page", "==", pageName) // Тек осы бетке арналған
      .where("parentId", "==", "root") // Тек басты бөлімдер
      .onSnapshot(snap => {
        grid.innerHTML = "";
        if (snap.empty) {
            grid.innerHTML = "<p style='grid-column: 1/-1; text-align:center; padding:20px; color:#999;'>Бұл бетке әзірге бөлім қосылмаған...</p>";
            return;
        }
        snap.forEach(doc => {
            const cat = doc.data();
            // Егер базада иконка болмаса, автоматты түрде атына қарап қояды
            const iconClass = cat.icon && cat.icon !== "" ? cat.icon : getAutoIcon(cat.name);
            
            grid.innerHTML += `
                <div class="card" onclick="location.href='category.html?id=${doc.id}&name=${encodeURIComponent(cat.name)}'">
                    <i class="fas ${iconClass}"></i>
                    <span>${cat.name}</span>
                </div>`;
        });
    }, err => console.log("Жүктеу қатесі:", err));
}

// 4. АУА РАЙЫ (Aktau)
async function getWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.65&longitude=51.17&current_weather=true');
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        const el = document.getElementById('weatherText');
        if(el) el.innerHTML = `<i class="fas fa-temperature-high"></i> ${temp}°C`;
    } catch (e) { console.log("Ауа райы қатесі"); }
}

// 5. НАМАЗ УАҚЫТЫ (Aktau)
async function getPrayerTimes() {
    try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Aktau&country=Kazakhstan&method=2');
        const data = await res.json();
        const t = data.data.timings;
        const el = document.getElementById('prayerText');
        if(el) el.innerHTML = `<i class="fas fa-mosque"></i> Бесін: ${t.Dhuhr}`;
    } catch (e) { console.log("Намаз уақыты қатесі"); }
}

// 6. ІЗДЕУ ЛОГИКАСЫ
function searchCards() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.getElementsByClassName('card');
    for (let card of cards) {
        let text = card.innerText.toLowerCase();
        card.style.display = text.includes(input) ? "flex" : "none";
    }
}

// 7. БЕТ ЖҮКТЕЛГЕНДЕ ІСКЕ ҚОСУ
document.addEventListener('DOMContentLoaded', () => {
    getWeather();
    getPrayerTimes();
    
    // Беттің атына қарай тиісті категорияларды жүктейміз
    loadPageCategories('home', 'categoryGrid');     // index.html үшін
    loadPageCategories('market', 'marketGrid');     // market.html үшін
    loadPageCategories('other', 'otherGrid');       // 3-ші бет үшін
    
    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        searchInput.addEventListener('keyup', searchCards);
    }
});

// 8. SERVICE WORKER
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW error'));
  });
}

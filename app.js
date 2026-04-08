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

// 2. АВТОМАТТЫ ИКОНКА ЛОГИКАСЫ (Сен жазған тізім сақталды)
function getAutoIcon(name) {
    const n = name.toLowerCase();
    const icons = {
        'такси': 'fa-taxi', 'көлік': 'fa-car', 'дүкен': 'fa-shopping-bag', 
        'маркет': 'fa-store', 'сауда': 'fa-shopping-cart', 'жұмыс': 'fa-briefcase',
        'тамақ': 'fa-utensils', 'асхана': 'fa-coffee', 'мед': 'fa-hospital',
        'дәріхана': 'fa-pills', 'мал': 'fa-cow', 'ет': 'fa-drumstick-bite',
        'үй': 'fa-home', 'пәтер': 'fa-building', 'телефон': 'fa-mobile-alt',
        'киім': 'fa-tshirt', 'құрылыс': 'fa-tools'
    };
    for (let key in icons) { if (n.includes(key)) return icons[key]; }
    return 'fa-th-large';
}

// 3. КАТЕГОРИЯЛАРДЫ БЕТТЕРГЕ БӨЛІП ЖҮКТЕУ
function loadCategoriesByPage(pageName, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    db.collection("categories")
      .where("page", "==", pageName)
      .onSnapshot(snap => {
        grid.innerHTML = "";
        if (snap.empty) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; font-size:12px; color:#999;">${pageName} бөлімі бос...</p>`;
            return;
        }
        snap.forEach(doc => {
            const cat = doc.data();
            const iconClass = cat.icon || getAutoIcon(cat.name);
            grid.innerHTML += `
                <div class="card-item" onclick="location.href='category.html?id=${doc.id}&name=${encodeURIComponent(cat.name)}'">
                    <i class="fas ${iconClass}"></i>
                    <span>${cat.name}</span>
                </div>`;
        });
    });
}

// 4. БАННЕРЛЕРДІ БАЗАДАН ЖҮКТЕУ (3 СЕКУНДТЫҚ)
function loadBanners(containerId, location) {
    const container = document.getElementById(containerId);
    if (!container) return;

    db.collection("banners").where("position", "==", location).onSnapshot(snap => {
        if (snap.empty) return;
        container.innerHTML = "";
        let index = 0;
        snap.forEach(doc => {
            const b = doc.data();
            const div = document.createElement('div');
            div.className = `slide ${index === 0 ? 'active' : ''}`;
            div.style.backgroundImage = `url('${b.url}')`;
            div.onclick = () => { if(b.link) window.location.href = b.link; };
            container.appendChild(div);
            index++;
        });
    });
}

// 5. НАМАЗ УАҚЫТЫ (АВТОМАТТЫ ЖАҢАРТУ)
async function updatePrayerTime() {
    try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Aktau&country=Kazakhstan&method=2');
        const data = await res.json();
        const t = data.data.timings;
        const now = new Date();
        const currentMin = now.getHours() * 60 + now.getMinutes();

        const times = [
            {n: "Таң", t: t.Fajr}, {n: "Бесін", t: t.Dhuhr}, 
            {n: "Екінті", t: t.Asr}, {n: "Ақшам", t: t.Maghrib}, {n: "Құптан", t: t.Isha}
        ];

        let nextPrayer = times[0];
        for (let p of times) {
            const [h, m] = p.t.split(':');
            if (parseInt(h) * 60 + parseInt(m) > currentMin) {
                nextPrayer = p; break;
            }
        }
        const el = document.getElementById('prayerTime');
        if(el) el.innerHTML = `${nextPrayer.n}: ${nextPrayer.t}`;
    } catch (e) { console.log("Prayer error"); }
}

// 6. АУА РАЙЫ
async function updateWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.65&longitude=51.17&current_weather=true');
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        const el = document.getElementById('temp');
        if(el) el.innerHTML = `${temp}°C`;
    } catch (e) { console.log("Weather error"); }
}

// 7. ЛОКАЦИЯ ТАҢДАУ
function locationSelect() {
    const locs = ["Батыр ауылы", "Ақтау қаласы", "Мұнайлы", "Шетпе", "Жанаөзен"];
    let choice = prompt("Локация таңдаңыз:\n" + locs.join("\n"));
    if (choice && locs.includes(choice)) {
        document.getElementById('locName').innerText = choice;
        localStorage.setItem('userLoc', choice);
    }
}

// 8. ІЗДЕУ ФУНКЦИЯСЫ
function searchApp() {
    const input = document.querySelector('.search-area input').value.toLowerCase();
    const cards = document.querySelectorAll('.card-item');
    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(input) ? "flex" : "none";
    });
}

// 9. БЕТ ЖҮКТЕЛГЕНДЕ БӘРІН ІСКЕ ҚОСУ
document.addEventListener('DOMContentLoaded', () => {
    updateWeather();
    updatePrayerTime();
    
    // Категорияларды беттерге тарату
    loadCategoriesByPage('home', 'mainGrid');
    loadCategoriesByPage('market', 'marketGrid');
    loadCategoriesByPage('other', 'profileGrid');

    // Баннерлерді жүктеу
    loadBanners('homeBanners', 'home');
    loadBanners('marketBanners', 'market');

    // Сақталған локацияны алу
    const savedLoc = localStorage.getItem('userLoc');
    if(savedLoc) document.getElementById('locName').innerText = savedLoc;
});

// SERVICE WORKER
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW error'));
    });
}

// 1. АУА РАЙЫ
async function getWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.65&longitude=51.17&current_weather=true');
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        document.getElementById('weatherText').innerHTML = `<i class="fas fa-temperature-high"></i> ${temp}°C`;
    } catch (e) { console.log("Weather error", e); }
}

// 2. НАМАЗ УАҚЫТЫ
async function getPrayerTimes() {
    try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Aktau&country=Kazakhstan&method=2');
        const data = await res.json();
        const t = data.data.timings;
        const names = { Fajr: "Таң", Dhuhr: "Бесін", Asr: "Екінді", Maghrib: "Ақшам", Isha: "Құптан" };
        
        // Келесі намазды есептеу (қарапайым түрі)
        document.getElementById('prayerText').innerHTML = `<i class="fas fa-mosque"></i> Бесін: ${t.Dhuhr}`;
    } catch (e) { console.log("Prayer error", e); }
}

// 3. ІЗДЕУ ЖҮЙЕСІ
function searchCards() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.getElementsByClassName('card');
    for (let card of cards) {
        let text = card.innerText.toLowerCase();
        card.style.display = text.includes(input) ? "flex" : "none";
    }
}

// ПАЙДАЛАНУ ШАРТТАРЫ (Жасырын функция)
function showRules() {
    alert("Пайдалану шарттары: 2026 BAIX. Барлық құқықтар қорғалған.");
}

// Іске қосу
window.addEventListener('DOMContentLoaded', () => {
    getWeather();
    getPrayerTimes();
});
// 1. FIREBASE КОНФИГУРАЦИЯСЫ (Сенің скриншотыңнан алынды)
const firebaseConfig = {
  apiKey: "AIzaSyCaIwrxsSc4s4SV_sIfOwcGaeB6obdpuzE",
  authDomain: "batyr-final.firebaseapp.com",
  projectId: "batyr-final",
  storageBucket: "batyr-final.firebasestorage.app",
  messagingSenderId: "621519255228",
  appId: "1:621519255228:web:6087e026a6db84afa2c2b9",
  measurementId: "G-73YT8RDF4W"
};

// Firebase-ті іске қосу
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 2. АУА РАЙЫ ФУНКЦИЯСЫ
async function getWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.65&longitude=51.17&current_weather=true');
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        const el = document.getElementById('weatherText');
        if(el) el.innerHTML = `<i class="fas fa-temperature-high"></i> ${temp}°C`;
    } catch (e) { console.log("Ауа райы қатесі:", e); }
}

// 3. НАМАЗ УАҚЫТЫ ФУНКЦИЯСЫ
async function getPrayerTimes() {
    try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Aktau&country=Kazakhstan&method=2');
        const data = await res.json();
        const t = data.data.timings;
        const el = document.getElementById('prayerText');
        if(el) el.innerHTML = `<i class="fas fa-mosque"></i> Бесін: ${t.Dhuhr}`;
    } catch (e) { console.log("Намаз уақыты қатесі:", e); }
}

// 4. ІЗДЕУ ФУНКЦИЯСЫ
function searchCards() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.getElementsByClassName('card');
    for (let card of cards) {
        let text = card.innerText.toLowerCase();
        card.style.display = text.includes(input) ? "flex" : "none";
    }
}

// 5. КАТЕГОРИЯЛАРДЫ БАЗАДАН ШЫҒАРУ (category.html үшін)
if (document.getElementById('listContainer')) {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    
    if (type) {
        db.collection("ads").where("category", "==", type).get().then((querySnapshot) => {
            const list = document.getElementById('listContainer');
            list.innerHTML = ""; 
            
            if (querySnapshot.empty) {
                list.innerHTML = '<p style="text-align:center; padding-top:20px;">Әзірге жарнама жоқ.</p>';
            }

            querySnapshot.forEach((doc) => {
                const ad = doc.data();
                list.innerHTML += `
                    <div class="item-card" style="background:white; padding:15px; border-radius:15px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div>
                            <div style="font-weight:bold; font-size:16px;">${ad.title}</div>
                            <div style="font-size:13px; color:#666;">${ad.description}</div>
                        </div>
                        <a href="tel:${ad.phone}" style="background:#25D366; color:white; width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; text-decoration:none;"><i class="fas fa-phone"></i></a>
                    </div>
                `;
            });
        });
    }
}

// БЕТ ЖҮКТЕЛГЕНДЕ ІСКЕ ҚОСУ
document.addEventListener('DOMContentLoaded', () => {
    getWeather();
    getPrayerTimes();
});
const langData = {
    'kk': { 'm-market': 'Маркет', 'm-meat': 'Ет', 'm-fish': 'Балық', 'm-feed': 'Жем-шөп', 'm-build': 'Құрылыс', 'm-cloth': 'Киім', 'm-parts': 'Запчасти', 'm-mebel': 'Мебель', 'm-flowers': 'Гүлдер', 'm-kanz': 'Оқу-құрал', 'm-phone': 'Телефон', 'm-cakes': 'Торттар', 'm-kids': 'Балалар әлемі' },
    'ru': { 'm-market': 'Продукты', 'm-meat': 'Мясо', 'm-fish': 'Рыба', 'm-feed': 'Корма', 'm-build': 'Стройка', 'm-cloth': 'Одежда', 'm-parts': 'Запчасти', 'm-mebel': 'Мебель', 'm-flowers': 'Цветы', 'm-kanz': 'Канцтовары', 'm-phone': 'Телефон', 'm-cakes': 'Торты', 'm-kids': 'Детский мир' }
};
// ЖАРНАМАЛАРДЫ КАТЕГОРИЯ БОЙЫНША СУРЕТПЕН ШЫҒАРУ ЛОГИКАСЫ
function renderAdsWithImages(querySnapshot) {
    const container = document.getElementById('listContainer');
    if(!container) return;
    
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const imgUrl = (data.images && data.images.length > 0) ? data.images[0] : 'https://via.placeholder.com/150';
        
        const html = `
            <div class="ad-card" style="display:flex; gap:15px; background:white; padding:10px; border-radius:12px; margin-bottom:10px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                <img src="${imgUrl}" style="width:100px; height:100px; object-fit:cover; border-radius:8px;">
                <div style="flex:1;">
                    <h4 style="margin:0; font-size:16px;">${data.title}</h4>
                    <p style="margin:5px 0; color:#007aff; font-weight:bold;">${data.price} ₸</p>
                    <p style="margin:0; font-size:12px; color:#777;">${data.phone}</p>
                </div>
            </div>`;
        container.innerHTML += html;
    });
}
// langData-ның ішіне (кейін реттеп алу үшін астына жаза сал)
'mal-bazar': 'Мал базар',
'avto': 'Көлік сату',
'uiler': 'Жер және Үй',
'stroy': 'Құрылыс заттары',
'turmys': 'Тұрмыстық заттар'

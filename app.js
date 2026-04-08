
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

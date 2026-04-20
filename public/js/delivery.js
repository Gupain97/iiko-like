



const weather = document.querySelector('.weather-list');



async function renderWeather() {
    const res = await fetch(`/api/delivery`, );
    const data = await res.json();
    console.log(data);
    weather.textContent = 'температура в Ростове-на-Дону: ' + data + '°';
    
}


renderWeather();


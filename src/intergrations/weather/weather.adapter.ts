// const { getWeather } = require('./wather.client');
import { getWeather } from './wather.client';


export async function getCurrentWeather(lat: number, lon: number) { 
    const data = await getWeather(lat, lon) ;
    return data.current_weather.temperature;
    
}

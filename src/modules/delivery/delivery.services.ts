import { getCurrentWeather } from "../../intergrations/weather/weather.adapter";



export async function getWeathForDev(lat: number, lot: number) {
    const result = getCurrentWeather(lat, lot);
    return result;
    
}
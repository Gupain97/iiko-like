import { Request, Response } from "express";
import { getWeather } from "../../intergrations/weather/wather.client";
import { getWeathForDev } from "./delivery.services"; 


export const getWeatherController = async (req:Request, res:Response) => {
    const result = await getWeathForDev(47.22, 39.72 );
    res.json(result)
}
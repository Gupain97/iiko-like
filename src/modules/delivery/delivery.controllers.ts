import { Request, Response } from "express";
import { getWeather } from "../../intergrations/weather/wather.client";
import { getWeathForDev } from "./delivery.services"; 


export const getWeatherController = async (req:Request, res:Response) => {
   // const {lat, lot } = req.params
    console.log('req params', req.params);
    const result = await getWeathForDev(47.22, 39.72 );
    console.log('result', result);
    res.json(result)
}
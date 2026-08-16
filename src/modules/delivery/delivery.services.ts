import { getCurrentWeather } from "../../intergrations/weather/weather.adapter";
import { createOrder, printOrder } from "../orders/order.services";
import { DeliveryOrder } from "./delivery.types";



export async function getWeathForDev(lat: number, lot: number) {
    const result = getCurrentWeather(lat, lot);
    return result;
    
}

export async function createDelivery( devOrder: DeliveryOrder) {
    console.log("создали заказ деливер:", devOrder);
    const orderId = await createOrder(422, 41, devOrder.items, 13, 5352);
    console.log("orderID:", orderId[0].id);
}
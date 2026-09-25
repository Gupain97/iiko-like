import { deliveryWebSocketService } from "../../bootstrap";
import { getCurrentWeather } from "../../intergrations/weather/weather.adapter";
import { MenuItem } from "../menu/menu.types";
import { addItemFromDB } from "../order-items/orderItems.service";
import { closeOrderByOrderId, createOrder, precheckOrder, printOrder } from "../orders/order.services";
import { OrderItem } from "../orders/order.types";
import { mapDeliveryOrdersDTO } from "./delivery.mapper";
import { createCustomerDataRepo, createDeliveryOrderRepo, createDeliveryRepo, getDeliveryFromDeliveryIdRepo, getDeliveryFromOrderIdRepo, getDeliveryOrdersRepo, updateStatusDeliverRepo } from "./delivery.repository";
import { CustomerData, CallCenterOrder, DeliveryOrder, DeliveryOrderDTO, DeliveryStatus } from "./delivery.types";



export async function getWeathForDev(lat: number, lot: number) {
    const result = getCurrentWeather(lat, lot);
    return result;
    
}

export async function createDelivery( devOrder: CallCenterOrder) {
    const order = await createDeliveryOrder(devOrder);
    const orderId = order[0].id; 
    await createCustomerData(devOrder, orderId);
 
    await addItemsDelivery(orderId, devOrder.items);
    await printOrder(orderId);
    const delivery = await createDeliveryRepo(orderId); // createDeliveryRepo у нас конкретно создает доставку
    //  с курьером и статуосом, основная сущность - orders, customer связан с заказом по ид , как и доставка.
    const deliveryId = delivery[0].id
    deliveryWebSocketService.sendMessage("Creating Delivery");
    await precheckOrder(orderId);

}

export async function addItemsDelivery(orderId: number, items: OrderItem[]) {
    for (const item of items) {
        await addItemFromDB(orderId, item.id, item.quantity);
    }
}

export async function createCustomerData( devOrder: CallCenterOrder, orderId: number ) {
    const customerData : CustomerData = {

        customerName : devOrder.customerName,
        phoneNumber: devOrder.phoneNumber,
        address: devOrder.address,
        eMail: "example.ru",
        orderId
    }

    await createCustomerDataRepo(customerData);
}

export async function createDeliveryOrder( data : CallCenterOrder ) {
    const order : DeliveryOrder = {
        source: "CALL-CENTER",
        status: "OPEN",
        guestsCount: data.guestsCount,
        createdBy: 41, // id колл-центра, имя Владимыч
        createdAt: new Date(),
        precheckAt: null,
        closedAt: null,
        comments: data.comments,
        items: data.items
    }

    const res = await createDeliveryOrderRepo(order);
    return res
};


export async function getDeliveryOrders() : Promise<DeliveryOrderDTO[]| null > {
    const res = await getDeliveryOrdersRepo();
    return mapDeliveryOrdersDTO(res);
}


export async function updateStatusDelivery(deliveryId: number, status: DeliveryStatus, userId:number) {
    const delivery = await getDeliveryFromDeliveryIdRepo(deliveryId);
    if (!delivery) throw new Error("DELIVERY IS NOT FOUND");
    const orderId = delivery.order_id // исправим 
    const deliveryStatus = delivery.status

    console.log(deliveryStatus, status);
    if (deliveryStatus === "NEW" && status === "SENT") {
        await updateStatusDeliverRepo(deliveryId, status, userId);
    } else if (deliveryStatus === "SENT" && status === "COMPLETE") {
        await updateStatusDeliverRepo(deliveryId, status, userId)
        await closeOrderByOrderId(orderId, userId);
    } else return null 
    
}

export async function getDeliveryFromOrderId(orderId: number) {
    const res = await getDeliveryFromOrderIdRepo(orderId);
    console.log("delId:", res[0].id);
    return res[0].id; // поправим
}
import { DeliveryOrder } from "../../modules/delivery/delivery.types";
import { OrderItem } from "../../modules/orders/order.types";



export function mapCallCenterToDelivery(center: any) : DeliveryOrder {
    const items = center.items ?? [];
    
    const res : DeliveryOrder = {
        service: "Call-Center",
        id: center.id,
        customerName: center.customer_name,
        address: center.address,
        phoneNumber: center.phone_number,
        comments: center.comments,
        items: items , //items.map(mapCallCenterItems),
        createdAt: center.created_at
    }

    return res
}

export function mapCallCenterItems(item: any): OrderItem {
    return {
        id: item.id,
        orderId: item.order_id,
        price: item.price,
        name: item.item_name,
        quantity: item.quantity,
        printed: item.printed,
        printedAt: item.printed_at

    }
}
import { CallCenterOrder, DeliveryOrder } from "../../modules/delivery/delivery.types";
import { OrderItem } from "../../modules/order-items/orderItems.types";



export function mapCallCenterToDelivery(center: any) : CallCenterOrder {
    const items = center.items ?? [];
    
    const res : CallCenterOrder = {
        service: "CALL-CENTER",
        crmOrderId: center.id,
        operatorId: center.operator_id,
        customerName: center.customer_name,
        address: center.address,
        phoneNumber: center.phone_number,
        guestsCount: center.guests_count,
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
        menuItemId: item.menu_item_id,
        quantity: item.quantity,
        printed: item.printed,
        printedAt: item.printed_at,
        comments: item.comments

    }
}
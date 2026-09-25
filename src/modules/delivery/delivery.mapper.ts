import { DeliveryOrderDTO } from "./delivery.types";


export function mapDeliveryOrdersDTO(rows: any): DeliveryOrderDTO[] | null {
    if (rows.length === 0 ) return null ;
    const orders : DeliveryOrderDTO[] = []
   // const first = rows[0];
    for (const first of rows ) {
        const order : DeliveryOrderDTO = {
            orderId : first.id,
            customerName: first.customer_name,
            address: first.address,
            phoneNumber: first.phone_number,
            guestsCount: first.guests_count, 
            comments: first.comments,
            eMail: first.e_mail,
            createdAt: first.created_at,
            deliveryStatus: first.delivery_status,
            items: [],
            total: 0
        }
        
        for (const row of rows) {
            if (row.item_order_id === order.orderId) {
                const itemTotal = row.price / 100 * row.qantity;
                order.total += itemTotal;
                order.items.push({
                    id: row.item_id,
                    orderId: row.id,
                    price: row.price / 100,
                    name: row.name,
                    quantity: row.quantity,
                    printed: row.printed,
                    printedAt: row.printed_at
                })
                
            }
        }
        const isAlreadyIncoming = orders.some( order => order.orderId=== first.id )
        if (!isAlreadyIncoming) orders.push(order);
    }


    return orders;

    

}
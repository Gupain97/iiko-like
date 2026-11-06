import { OrderItem, OrderItemRaw, OrderItemSale } from "./orderItems.types";


export function mapOrderItems(raw: OrderItemRaw[]): OrderItem[] {
    return raw.map(row => ({
        id: row.id,
        orderId: row.order_id,
        price: Number(row.price),
        name: row.name,
        quantity: row.quantity,
        printed: row.printed,
        printedAt: row.printed_at,
        menuItemId: row.menu_item_id,
        comments: row.comments
    }) satisfies OrderItem);
};

export function mapItemsToSale(items:OrderItem[], saleId: number) : OrderItemSale[] {
    const result : OrderItemSale[] = [];

    items.forEach((item: OrderItem) => {
        const existing = result.find(i => i.menuItemId === item.menuItemId);
        if (existing) {
            existing.quantity += item.quantity;
            existing.lineTotal += item.quantity * item.price
        } else {
            const lineTotal = item.price * item.quantity
            result.push({...item, saleId, lineTotal });
        }
    });

    return result;

    
    
}
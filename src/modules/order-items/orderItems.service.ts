import { AppError } from "../../errors/AppErrors";
import { findItemByIdRepo } from "../menu/menu.repository";
import { mapOrderFullDTO, mapOrderWithItems } from "../orders/order.mapper";
import { findOrderByOrderIdRepo, getNextOrderItemsIdSeq,  } from "../orders/order.repository";
import { addItemQuantityRepo, addItemRepo, getAddedItemOrUndefinedRepo, getItemByItemIdRepo } from "./orderItems.repository";




export async function addItemFromDB(orderId: number, menuItemId: number) : Promise<any  | undefined> { // поставить потом тип возвращаемых данных
    const existingOrder = await findOrderByOrderIdRepo(orderId)
    const order = mapOrderWithItems(existingOrder);
    const itemData = await findItemByIdRepo(menuItemId); // menu_item
    console.log(menuItemId);

    
    if (!order || !itemData) throw new Error("ORDER_OR_ITEM_NOT_FOUND");
    if (order.status !== "OPEN" && order.status !== "PRINTED") throw new AppError("ORDER_NOT_OPEN!", 400);


    const checkAddedItem = await getAddedItemOrUndefinedRepo(itemData.id, orderId);
    if (checkAddedItem) {
        await addItemQuantityRepo(checkAddedItem.id);
        const upOrder = await findOrderByOrderIdRepo(orderId);
        return {
            order : mapOrderFullDTO(upOrder),
            addedItemId: checkAddedItem.id
        };
    }

    
    const item = {
        id: getNextOrderItemsIdSeq(),
        orderId: order.id,
        printed: false,
        printedAt: null,
        name: itemData.name,
        price: itemData.price,
        quantity: 1,
        menuItemId: menuItemId
    };
    
    if (!item) throw new Error("ITEM_NOT_CREATED");
    
    
    
    const addedItem = await addItemRepo(item);


    const newOrder = await findOrderByOrderIdRepo(orderId);
    if (!newOrder) return mapOrderFullDTO(existingOrder);
    console.log('create');

    return  {
        order : mapOrderFullDTO(newOrder),
        addedItemId: addedItem.id
    }; 
}




export async function addItemQuantity(itemId: number, orderId: number) {
    const item = await  getItemByItemIdRepo(itemId);
    const menuItemId = item.menu_item_id;

    if (!item.printed) {
        await addItemQuantityRepo(itemId);
    } else { 
        await addItemFromDB(orderId, menuItemId);
    }

    const res = await findOrderByOrderIdRepo(orderId);
    console.log('add');
    return mapOrderFullDTO(res);
}
import { AppError, DishInStopList, ItemStatusError, ValidationError } from "../../errors/AppErrors";
import { findItemByIdRepo } from "../menu/menu.repository";
import { getAllMenu } from "../menu/menu.services";
import { OrderDTO, OrderFullDTO } from "../orders/order.dto";
import { mapOrderFullDTO, mapOrderWithItems } from "../orders/order.mapper";
import { findOrderByOrderIdRepo, getNextOrderItemsIdSeq,  } from "../orders/order.repository";
import { getOrderById } from "../orders/order.services";
import { checkDishInStop, checkDishRemainder, decrementRemainder } from "../stop-list/stop-list.services";
import { addItemQuantityRepo, addItemRepo, decrementItemQantityRepo, deleteItemRepo, getAddedItemOrUndefinedRepo, getItemByItemIdRepo, getMarkItemsRepo, getPrintedCashForWaiterRepo } from "./orderItems.repository";


const topRoles = ["MANAGER", "DIRECTOR"];

export async function addItemFromDB(orderId: number, menuItemId: number, qty?: number) : Promise< any  | undefined> { // поставить потом тип возвращаемых данных
    const existingOrder = await findOrderByOrderIdRepo(orderId)
    const order = mapOrderWithItems(existingOrder);
    const itemData = await findItemByIdRepo(menuItemId); // menu_item
    const checkDish = await checkDishInStop(menuItemId);
    const remainder = await checkDishRemainder(menuItemId);
    const quantity = qty ?? 1;
    let menu = await getAllMenu();
    if (checkDish) {
        return {
        order: mapOrderFullDTO(existingOrder),
        menu: menu
        }
    }
    // if (itemData?.isActive !== true ) return {
    //     order: mapOrderFullDTO(existingOrder)
    // };

    
    if (!order || !itemData) throw new Error("ORDER_OR_ITEM_NOT_FOUND");
    if (order.status !== "OPEN" && order.status !== "PRINTED") throw new AppError("ORDER_NOT_OPEN!", 400);
    if (remainder > 0 ) {
        await decrementRemainder(menuItemId);
    }

    


    const checkAddedItem = await getAddedItemOrUndefinedRepo(itemData.id, orderId);
    if (checkAddedItem) {
        await addItemQuantityRepo(checkAddedItem.id);
        const upOrder = await findOrderByOrderIdRepo(orderId);
        const menu = await getAllMenu();
        return {
            order : mapOrderFullDTO(upOrder),
            addedItemId: checkAddedItem.id,
            menu: menu
        };
    }

    
    const item = {
        id: getNextOrderItemsIdSeq(),
        orderId: order.id,
        printed: false,
        printedAt: null,
        name: itemData.name,
        price: itemData.price,
        quantity: quantity,
        menuItemId: menuItemId
    };
    
    if (!item) throw new Error("ITEM_NOT_CREATED");
    
    const addedItem = await addItemRepo(item);
    menu = await getAllMenu();

    const newOrder = await findOrderByOrderIdRepo(orderId);
    if (!newOrder) return mapOrderFullDTO(existingOrder);


    return  {
        order : mapOrderFullDTO(newOrder),
        addedItemId: addedItem.id,
        menu: menu,
        categoryId: menu.categories
    }; 
}




export async function addItemQuantity(itemId: number, orderId: number) : Promise<OrderDTO | null> {
    const item = await  getItemByItemIdRepo(itemId);
    const menuItemId = item.menu_item_id; // snake
    const check = await checkDishInStop(menuItemId);
    if (check) throw new DishInStopList();

    if (!item.printed) {
        await addItemQuantityRepo(itemId);
    } else { 
        await addItemFromDB(orderId, menuItemId);
    }

    const res = await findOrderByOrderIdRepo(orderId);
    return mapOrderFullDTO(res);
}

export async function decrementItemQantity(itemId: number, orderId: number): Promise<{ order: OrderFullDTO | null ; itemId: number | null ; }> {
    const item = await  getItemByItemIdRepo(itemId);
    if (item.printed) throw new ItemStatusError();
    let itId = null;
    if (item.quantity > 1 ) {
        await decrementItemQantityRepo(itemId);
        itId = itemId;
    } else {
        await deleteItemRepo(itemId);
    }
    
    const res = await findOrderByOrderIdRepo(orderId);
    return {
        order: mapOrderFullDTO(res),
        itemId: itId 
    };
    
}

export async function deletItemFromOrder(itemId: number, orderId: number, userRole: any): Promise<OrderFullDTO | null> {
    const order = await getOrderById(orderId);
    if (!order || order.status === "PRECHECK") return order;
    const item = await getItemByItemIdRepo(itemId);
    if (item.printed && !topRoles.includes(userRole)) throw new ItemStatusError();
    await deleteItemRepo(itemId);
    const res = await findOrderByOrderIdRepo(orderId);
    return mapOrderFullDTO(res);
}


export async function getPrintedCashForWaiter(userId: number) {
    const res = await getPrintedCashForWaiterRepo(userId);
    return res;
}



export async function getMarkItems(orderId: number) {
    const res = await getMarkItemsRepo(orderId);
    return res;
}


import { Request, Response } from "express";
import { getTableById, openTable, setGuestsCount, getTablesForCashier } from "./tables.services";
import { getTables } from "./tables.services";
import { closeTable } from "./tables.services";
import { getActiveOrders } from "../orders/order.services";

// export const openTableController = async (req: Request, res: Response) => { 
    
//         const { tableId, userId } = req.body; 
//         const table = openTable(tableId, userId);

//         res.status(201).json(table)
// };

// export const getTablesForCashierController = async (req: Request, res: Response) => {
//   const userId = Number(req.params.userId)
//   const tables = await getTablesForCashier(userId);
//   const activeOrders = await getActiveOrders();
  
//   if (!activeOrders || !tables) return;
//   const result = tables.map(table => {
//     const order = activeOrders.find(o => o.tableId === table.id)

//     return {
//       id: table.id,
//       guestsCount: table.guestsCount,
//       openedAt: table.openedAt,
//       orderStatus: order ? order.status : null
//     }
//   })
//   res.json(result)
// }

export const getTablesController = async (req: Request, res: Response) => {
  const tables = await getTables();
  const activeOrders = await getActiveOrders();

  if (!activeOrders || !tables) {
    return; 
  }


  const result = tables.map(table => {
    const order = activeOrders.find(o => o.tableId === table.id)

    return {
      id: table.id,
      guestsCount: table.guestsCount,
      openedAt: table.openedAt,
      orderStatus: order ? order.status : null
    }
  })
 
  res.json(result)
  
}

export const closeTableController = async (req: Request, res:Response) => {
    const{tableId, userId, orderId } = req.body;
    const table = closeTable(Number(tableId), Number(userId), Number(orderId));
 
    res.json(table);

  
};

export const getTableByIdController = async (req: Request, res: Response) => {
  const tableId = Number(req.params.id) ;

  const table = getTableById(tableId);
  
  res.json(table);
}

export const setGuestsController =  async (req: Request, res: Response ) => {
    const tableId = Number(req.params.id);
    const { guestsCount } = req.body;

    const table = setGuestsCount(tableId, guestsCount)
    
    res.json(table);
}


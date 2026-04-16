 
// import { closeOrderByOrderId } from "../orders/order.services";
// // import { tables } from "./tables.storage";
// import { Table } from './tables.types';
// import { closeTableRepo, findTableByTableIdRepo , getTablesRepo, saveTableRepo, updateTableRepo } from "./tables.repository"; 
// import { mapTableToService } from "./tables.mapper";
// import { AppError } from "../../errors/AppErrors";

// export async function openTable(tableId: number, cashierId: number, guestsCount: number ): Promise<Table| undefined> {
//     const existingTable = await findTableByTableIdRepo(tableId);

//     if (existingTable && existingTable.isOpen) return existingTable;
    

//     const table : Table = {
//         id: tableId,
//         isOpen: true,
//         cashierId,
//         guestsCount,
//         openedAt: new Date(),
//     };
    
//     if (!existingTable) {
//         await saveTableRepo(table);
//     }
//     const newTable = await updateTableRepo(tableId, table);
//     if (!newTable) throw new AppError('MOST ADD NEW TABLE') // исправить 

//     return newTable;
// }

// export async function getTableById(tableId: number): Promise<Table | null> {
//     const table = await findTableByTableIdRepo(tableId);


//     return table || null 
// }

// export async function getTables(): Promise<Table[] | undefined> {
//     return await getTablesRepo();
// }

// export async function getTablesForCashier(cashierId: number): Promise<Table[] | undefined> {
//     const tables = await getTablesRepo();
//     if (!tables) return 
//     return tables.filter(t => t.cashierId === cashierId);
    
    
// }

// export async function closeTable(tableId: number, cashierId: number, orderId: number): Promise<Table> {
//    // const table = tables.find(t => t.id === tableId && t.cashierId === cashierId  );
//     const table = await findTableByTableIdRepo(tableId);


     

//     if (!table ) {
//         throw new Error('TABLE NOT OPEN!');

//     }
    
//     if (cashierId !== table.cashierId) {
//         throw new Error('NOT YOUR TABLE!')
//     }
    
//     table.isOpen = false;
//     table.cashierId = null;
//     table.openedAt = null;
//     table.guestsCount = 0;
//     await closeTableRepo(tableId);
//     await closeOrderByOrderId(orderId, cashierId);

//     return table;
// }

// export async function setGuestsCount(tableId: number, guestsCount: number): Promise<Table> {
//     const table = await findTableByTableIdRepo(tableId);
    
//     if (!table || !table.isOpen) {
//         throw new Error('TABLE_NOT_OPEN');
//     }

//     if (table.guestsCount && table.guestsCount < 1 ) {
//         throw new Error('INVALID_COUNT_GUESTS');
//     }

//     table.guestsCount = guestsCount

//     return table 

    
// }


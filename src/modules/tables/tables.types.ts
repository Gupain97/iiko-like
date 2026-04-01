export interface Table {
    id: number;
    isOpen: boolean;
    cashierId: number | null;
    guestsCount: number | null;
    openedAt: Date | null;
}
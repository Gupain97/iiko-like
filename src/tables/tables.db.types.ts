export interface TableRow {
    id : number;
    is_open: boolean;
    user_id: number;
    guests_count: number;
    opened_at: Date | null;
}
export interface SessionType {
    id : number;
    sessionId: string;
    entityType: string;
    entityId: number;
}

export interface SessionRaw {
    id: number;
    session_id: string;
    entity_type: string;
    entity_id: number;
}
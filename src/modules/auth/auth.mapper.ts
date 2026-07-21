import { SessionRaw, SessionType } from "./auth.types/session.type";

export function mapSessionRaw(rows: SessionRaw[]): SessionType {
    const first = rows[0];
    const res : SessionType = {
        id: first.id ,
        sessionId: first.session_id,
        entityType: first.entity_type,
        entityId: first.entity_id

    };

    return res
}
CREATE TYPE entity_type AS ENUM (
    'USER',
    'STATION'
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    session_id UUID UNIQUE NOT NULL,
    entity_type entity_type,
    entity_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NULL
)
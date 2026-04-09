CREATE TYPE user_status AS ENUM (
    'OPEN',
    'CLOSED'
);


CREATE TABLE shifts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    status user_status DEFAULT 'OPEN',
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP   
);
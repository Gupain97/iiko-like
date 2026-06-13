CREATE TYPE ticket_status AS ENUM (
    'NEW',
    'READY'
);

CREATE TYPE item_status AS ENUM (
    'NEW',
    'READY',
    'GIVEN'
);


CREATE TABLE station_tickets (
    id SERIAL PRIMARY KEY,
    order_id INTEGER,
    status ticket_status DEFAULT 'NEW'
    
);

CREATE TABLE station_ticket_items (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER,
    order_item_id INTEGER,
    status item_status DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT NOW(),
    ready_at TIMESTAMP
    
);
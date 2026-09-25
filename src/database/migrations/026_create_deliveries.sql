CREATE TYPE deliveries_status AS ENUM (
    'NEW',
    'SENT',
    'COMPLETE'
);


CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    status deliveries_status DEFAULT 'NEW',
    order_id INTEGER,
    courier_id INTEGER,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP 
);

CREATE TABLE deliveries_history (
    id SERIAL PRIMARY KEY,
    delivery_id INTEGER,
    status deliveries_status,
    created_at TIMESTAMP,
    created_by INTEGER
);
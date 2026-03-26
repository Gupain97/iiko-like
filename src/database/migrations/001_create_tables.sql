CREATE TYPE order_status AS ENUM (
    'OPEN',
    'PRECHECK',
    'CLOSED'
);


CREATE TABLE tables (
    id SERIAL PRIMARY KEY,
    is_open BOOLEAN DEFAULT false,
    guests_count INTEGER DEFAULT 0,
    opened_at TIMESTAMP

);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status order_status DEFAULT 'OPEN',
    table_id INTEGER REFERENCES tables(id),
    created_at TIMESTAMP DEFAULT NOW(),
    prechecked_at TIMESTAMP,
    closed_at TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    name TEXT,
    quantity INTEGER,
    price NUMERIC(10, 2),
    printed BOOLEAN DEFAULT false,
    printed_at TIMESTAMP
);




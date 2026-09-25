CREATE TYPE sources AS ENUM (
    'POS',
    'CALL-CENTER'
);



CREATE TABLE customer_data (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    custoьer_name TEXT,
    phone_number TEXT,
    address TEXT,
    e_mail TEXT
);


ALTER TABLE orders
ADD COLUMN source sources,
ADD COLUMN comments TEXT;

ALTER TABLE order_items
ADD COLUMN comments TEXT;



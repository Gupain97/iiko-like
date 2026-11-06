CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    user_id INTEGER REFERENCES users(id),
    total_amount INTEGER,
    closed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(id),
    menu_item_id INTEGER,
    quantity INTEGER,
    price INTEGER,
    line_total INTEGER
);

CREATE TABLE sale_item_ingredients (
    id SERIAL PRIMARY KEY,
    name TEXT,
    quantity INTEGER,
    unit TEXT,
    sale_item_id INTEGER REFERENCES sale_items(id)
);
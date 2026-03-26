CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name TEXT,
    price INTEGER,
    category_id INTEGER,
    is_active BOOLEAN
);
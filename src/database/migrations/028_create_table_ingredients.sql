CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name TEXT,
    unit TEXT,
    quantity INTEGER,
    created_at TIMESTAMP DEFAULT NOW()

);


CREATE TABLE dish_ingredients (
    id SERIAL PRIMARY KEY,
    ingredient_id INTEGER REFERENCES ingredients(id),
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
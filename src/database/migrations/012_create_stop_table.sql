CREATE TABLE stop_list (
    dish_id INTEGER,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    removed_by INTEGER,
    removed_at TIMESTAMP 
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    pin INTEGER,
    created_at TIMESTAMP DEFAULT NOW()

);

ALTER TABLE tables
ADD COLUMN user_id INTEGER REFERENCES users(id);

ALTER TABLE orders
ADD COLUMN created_by INTEGER REFERENCES users(id);

ALTER TABLE orders
ADD COLUMN closed_by INTEGER REFERENCES users(id);

CREATE TABLE station_categories (
    category_id INT REFERENCES category(id),
    station_id INT REFERENCES station(id)
);

ALTER TABLE station 
ADD COLUMN sound_enable BOOLEAN DEFAULT TRUE,
ADD COLUMN visiable_statuses TEXT[]
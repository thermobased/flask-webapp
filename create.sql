CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, login TEXT UNIQUE, password TEXT);
DELETE FROM items;
INSERT INTO items(login, password) VALUES('admin', 'admin');

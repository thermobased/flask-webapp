CREATE TABLE  items (id INTEGER PRIMARY KEY, login TEXT UNIQUE, password BLOB);
INSERT INTO items(login, password) VALUES('admin', 'admin');
CREATE TABLE sessions (login TEXT UNIQUE, cookie_key TEXT);


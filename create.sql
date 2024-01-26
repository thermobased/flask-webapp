CREATE TABLE  items (id INTEGER PRIMARY KEY, login TEXT UNIQUE, password BLOB);
CREATE TABLE habits (login TEXT, habit TEXT, checkmark INTEGER);
CREATE TABLE sessions (login TEXT, cookie_key TEXT);
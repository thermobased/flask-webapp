CREATE TABLE  items (id INTEGER PRIMARY KEY, login TEXT UNIQUE, password BLOB);
CREATE TABLE sessions (login TEXT, cookie_key TEXT, FOREIGN KEY(login) REFERENCES items(login));
CREATE TABLE habits (id INTEGER PRIMARY KEY, login TEXT, habit TEXT, UNIQUE(login, habit) FOREIGN KEY(login) REFERENCES items(login));
--CREATE TABLE days (habit INTEGER, den TEXT, FOREIGN KEY (habit) REFERENCES habits(id));

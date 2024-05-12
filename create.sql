CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  login TEXT UNIQUE,
  password BLOB
);

CREATE TABLE sessions (
  login TEXT,
  cookie_key TEXT,
  FOREIGN KEY(login) REFERENCES users(login)
);

CREATE TABLE habits (
  id INTEGER PRIMARY KEY,
  login TEXT,
  habit TEXT,
  UNIQUE(login, habit)
  FOREIGN KEY(login) REFERENCES users(login)
);

CREATE TABLE datapoints (
  id INTEGER PRIMARY KEY,
  login TEXT,
  habit TEXT,
  occasion TEXT,
  datapoint INTEGER,
  comment TEXT,
  FOREIGN KEY(login, habit) REFERENCES habits(login, habit)
  UNIQUE(login, habit, occasion, comment)
);

--CREATE TABLE days (habit INTEGER, den TEXT, FOREIGN KEY (habit) REFERENCES habits(id));





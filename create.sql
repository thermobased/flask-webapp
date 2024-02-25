CREATE TABLE items (
  id INTEGER PRIMARY KEY,
  login TEXT UNIQUE,
  password BLOB
);

CREATE TABLE sessions (
  login TEXT,
  cookie_key TEXT,
  FOREIGN KEY(login) REFERENCES items(login)
);

CREATE TABLE habits (
  id INTEGER PRIMARY KEY,
  login TEXT,
  habit TEXT,
  UNIQUE(login, habit)
  FOREIGN KEY(login) REFERENCES items(login)
);

CREATE TABLE datapoints (
  login TEXT,
  habit TEXT,
  occasion TEXT,
  datapoint INTEGER,
  comment TEXT,
  FOREIGN KEY(login, habit) REFERENCES habits(login, habit)
  UNIQUE(login, habit, occasion, comment)
);

--CREATE TABLE days (habit INTEGER, den TEXT, FOREIGN KEY (habit) REFERENCES habits(id));


--INSERT INTO datapoints (login, habit, chislo, datapoint, comment) VALUES ('niggers', 'eating chicken', date(), 228, 'niggers ate chicken!');
--INSERT INTO datapoints (login, habit, chislo, datapoint) VALUES ('vanja', 'b', time(), 'not ok');

--INSERT INTO datapoints (login, habit, chislo, datapoint, comment) VALUES ('niggers', 'programming', date(), 1, 'niggers did programming!');
--INSERT INTO datapoints (login, habit, chislo, datapoint, comment) VALUES ('niggers', 'programming', time(), 2, 'ok!');
--INSERT INTO datapoints (login, habit, chislo, datapoint, comment) VALUES ('niggers', 'programming', time(), 1, 'kekw!');




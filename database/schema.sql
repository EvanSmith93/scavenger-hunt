DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS hint;

CREATE TABLE IF NOT EXISTS hint (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
    name VARCHAR(100),
    description VARCHAR(100) NOT NULL,
    gameId INT NOT NULL
);

CREATE TABLE IF NOT EXISTS game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL
);

INSERT INTO game (name) VALUES ('Game 1');
INSERT INTO hint (name, description, gameId) SELECT 'Hint 1', 'The description for hint 1', id FROM game WHERE name = 'Game 1';
INSERT INTO hint (description, gameId) SELECT 'The description for an unnamed hint', id FROM game WHERE name = 'Game 1';

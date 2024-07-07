DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS hint;

CREATE TABLE IF NOT EXISTS hint (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
    hint VARCHAR(100) NOT NULL,
    gameId INT NOT NULL
);

CREATE TABLE IF NOT EXISTS game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL
);

INSERT INTO game (name) VALUES ('Game 1');
INSERT INTO hint (hint, gameId) SELECT 'Hint 1', id FROM game WHERE name = 'Game 1';
INSERT INTO hint (hint, gameId) SELECT 'Hint 2', id FROM game WHERE name = 'Game 1';

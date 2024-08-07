const express = require("express");
const path = require("path");
const cors = require("cors");
// const mysql = require('mysql2');
const sqlite3 = require("sqlite3").verbose();
var bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const port = 3001;

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

dotenv.config();

// AWS RDS MySQL connection details
// const dbConfig = {
//   host: process.env.HOST,
//   user: process.env.USERNAME,
//   password: process.env.PASSWORD,
//   database: 'scavenger_hunt',
// };

// Create a pool to handle database connections
// const pool = mysql.createPool(dbConfig);

const dbPath = "../database/scavenger_hunt.db";
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-memory SQlite database.");
});

// Insert hint into the database
app.post("/add-hint", (req, res) => {
  db.serialize(() => {
    db.run(
      "INSERT INTO hint (name, description, gameid) VALUES (?, ?, ?)",
      [req.body.name, req.body.description, req.body.gameId],
      function (err) {
        if (err) {
          console.error(err.message);
          return res.status(500).send({ ok: false, body: err.message });
        }

        // Fetch the last inserted ID
        db.get(
          "SELECT id FROM hint WHERE rowid = last_insert_rowid()",
          (err, row) => {
            if (err) {
              console.error(err.message);
              return res.status(500).send({ ok: false, body: err.message });
            }
            res.json({ ok: true, body: row.id });
          }
        );
      }
    );
  });
});

// Retrieve a hint by ID from the database
app.get("/get-hint/:id", (req, res) => {
  console.log("getting one hint: " + req.params.id);
  db.get("SELECT * FROM hint WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send({ ok: false, body: err });
    } else if (!row) {
      res.status(404).send({ ok: false, body: "Hint not found" });
    } else {
      res.json({ ok: true, body: row });
    }
  });
});

// Retrieve all hints for a specific game
app.get("/get-hints-for-game/:gameId", (req, res) => {
  db.all(
    "SELECT * FROM hint WHERE gameId = ?",
    [req.params.gameId],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send({ ok: false, body: err });
      } else {
        res.json({ ok: true, body: rows });
      }
    }
  );
});

// Retrieve the number of hints for a specific game
app.get("/get-hint-count/:gameId", (req, res) => {
  db.get(
    "SELECT COUNT(*) AS count FROM hint WHERE gameId = ?",
    [req.params.gameId],
    (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send({ ok: false, body: err });
      } else {
        res.json({ ok: true, body: row.count });
      }
    }
  );
});

// Validate hints for a specific game (returns the list of valid hints)
app.post("/validate-hints/:gameId", (req, res) => {
  console.log('validate-hints');
  db.all(
    "SELECT id FROM hint WHERE gameId = ?",
    [req.params.gameId],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send({ ok: false, body: err });
      } else {
        console.log(req);
        const validRows = req.body.hintsFound.filter((hintId) =>
          rows.some((row) => row.id == hintId)
        );
        res.json({ ok: true, body: validRows });
      }
    }
  );
});

// Update a hint by ID in the database
app.put("/update-hint", (req, res) => {
  db.run(
    "UPDATE hint SET name = ?, description = ? WHERE id = ?",
    [req.body.name, req.body.description, req.body.id],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send({ ok: false, body: err });
      } else {
        res.status(200).send({ ok: true });
      }
    }
  );
});

// Delete a hint by ID from the database
app.delete("/delete-hint/:id", (req, res) => {
  db.run("DELETE FROM hint WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send({ ok: false, body: err });
    } else {
      res.status(200).send({ ok: true });
    }
  });
});

// Insert game into the database
app.post("/add-game", (req, res) => {
  console.log("adding game: " + req.body.name);
  db.run("INSERT INTO game (name) VALUES (?)", [req.body.name], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send({ ok: false, body: err });
    } else {
      res.send({ ok: true, id: this.lastID });
    }
  });
});

// Retrieve a game by ID from the database
app.get("/get-game/:id", (req, res) => {
  db.get("SELECT * FROM game WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send({ ok: false, body: err });
    } else if (!row) {
      res.status(404).send({ ok: false, body: "Game not found" });
    } else {
      res.status(200).send({ ok: true, body: row });
    }
  });
});

// Retrieve all games from the database
app.get("/get-all-games", (req, res) => {
  db.all(
    "SELECT game.*, COUNT(hint.id) AS hintCount FROM game LEFT JOIN hint ON game.id = hint.gameId GROUP BY game.id",
    (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send({ ok: false, body: err });
      } else {
        res.status(200).send({ ok: true, body: rows });
      }
    }
  );
});

// Update a game by ID in the database
app.put("/update-game", (req, res) => {
  db.run(
    "UPDATE game SET name = ? WHERE id = ?",
    [req.body.name, req.body.id],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send({ ok: false, body: err });
      } else {
        res.status(200).send({ ok: true });
      }
    }
  );
});

// Delete a game by ID from the database
app.delete("/delete-game/:id", (req, res) => {
  db.serialize(() => {
    db.run("DELETE FROM game WHERE id = ?", [req.params.id], function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send({ ok: false, body: err });
      }
    });
    db.run(
      "DELETE FROM hint WHERE gameId = ?",
      [req.params.id],
      function (err) {
        if (err) {
          console.error(err.message);
          res.status(500).send({ ok: false, body: err });
        }
        res.status(200).send({ ok: true });
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

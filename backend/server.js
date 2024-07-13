const express = require('express');
const path = require('path');
const cors = require('cors');
// const mysql = require('mysql2');
const sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser')
const dotenv = require('dotenv');
const app = express();
const port = 3001;

const corsOptions = {
    origin: '*'
}

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

const dbPath = '../database/scavenger_hunt.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

// Insert hint into the database
app.post('/add-hint', (req, res) => {
    db.serialize(() => {
        db.run('INSERT INTO hint (hint, gameid) VALUES (?, ?)', [req.body.hint, req.body.gameId], function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send({ ok: false, body: err.message });
            }

            // Fetch the last inserted ID
            db.get('SELECT id FROM hint WHERE rowid = last_insert_rowid()', (err, row) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send({ ok: false, body: err.message });
                }
                res.json({ ok: true, body: row.id });
            });
        });
    });
});

// Retrieve a hint by ID from the database
app.get('/get-hint/:id', (req, res) => {
    console.log('getting one hint: ' + req.params.id)
    db.get('SELECT * FROM hint WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send({ ok: false, body: err });
        } else if (!row) {
            res.status(404).send({ ok: false, body: 'Hint not found' });
        } else {
            res.json({ ok: true, body: row })
        }
    });
});

// Retrieve all hints from the database
app.get('/get-all-hints', (req, res) => {
    db.all('SELECT * FROM hint', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send({ok: false, body: err});
        } else {
            res.json({ok: true, body: rows});
        }
    });
});

// Retrieve all hints for a specific game
app.get('/get-hints-for-game/:gameId', (req, res) => {
    db.all('SELECT * FROM hint WHERE gameId = ?', [req.params.gameId], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send({ ok: false, body: err });
        } else {
            res.json({ ok: true, body: rows });
        }
    });
});

// Insert game into the database
app.post('/add-game', (req, res) => {
    console.log('adding game: ' + req.body.name)
    db.run('INSERT INTO game (name) VALUES (?)', [req.body.name], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send({ ok: false, body: err });
        } else {
            res.send({ ok: true, id: this.lastID });
        }
    });
});

// Retrieve all games from the database
app.get('/get-all-games', (req, res) => {
    db.all('SELECT * FROM game', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send({ ok: false, body: err });
        } else {
            res.status(200).send({ ok: true, body: rows });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

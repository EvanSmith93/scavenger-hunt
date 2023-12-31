const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
var bodyParser = require('body-parser')
const dotenv = require('dotenv');
const app = express();
const port = 3000;

const corsOptions = {
  origin: '*'
}

app.use(cors(corsOptions));
app.use(bodyParser.json());

dotenv.config();

// AWS RDS MySQL connection details
const dbConfig = {
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: 'scavenger_hunt',
};

console.log(dbConfig);

// Create a pool to handle database connections
const pool = mysql.createPool(dbConfig);

// Insert hint into the database
app.post('/add-hint', (req, res) => {
    pool.query('INSERT INTO hints (id, hint, gameid) VALUES (?, ?, ?)', [req.body.id, req.body.hint, req.body.gameId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ok: false, body: err});
        } else {
            res.json({ok: true, body: results.insertId});
        }
    });
});

// Retrieve a hint by ID from the database
app.get('/get-hint/:id', (req, res) => {
    console.log('getting one hint: ' + req.params.id)
    pool.query('SELECT * FROM hints WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).send({ok: false, body: err});
        } else {
            console.log(results);
            if (results.length > 0) {
                res.json({ok: true, body: results[0]});
            } else {
                res.status(404).send({ok: false, body: 'Hint not found'});
            }
        }
    });
});

// Retrieve all hints from the database
app.get('/get-all-hints', (req, res) => {
    // pool.query('SELECT * FROM hints', (err, results) => {
    //     if (err) {
    //         res.status(500).send({ok: false, body: err});
    //     } else {
    //         res.json({ok: true, body: results});
    //     }
    // });
});

// Retrieve all hints for a specific game
app.get('/get-hints-for-game/:gameId', (req, res) => {
    pool.query('SELECT * FROM hints WHERE gameid = ?', [req.params.gameId], (err, results) => {
        if (err) {
            res.status(500).send({ok: false, body: err});
        } else {
            res.json({ok: true, body: results});
        }
    });
});

// Insert game into the database
app.post('/add-game', (req, res) => {
    pool.query('INSERT INTO games (name) VALUES (?)', [req.body.name], (err, results) => {
        if (err) {
            res.status(500).send({ok: false, body: err});
        } else {
            console.log(results);
            res.send({ok: true, id: results.insertId});
        }
    });
});

// Retrieve all games from the database
app.get('/get-all-games', (req, res) => {
    pool.query('SELECT * FROM games', (err, results) => {
        if (err) {
            res.status(500).send({ok: false, body: err});
        } else {
            // send back the results with an ok status
            res.status(200).send({ok: true, body: results});
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

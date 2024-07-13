const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const sql = fs.readFileSync('./schema.sql').toString();

const dbPath = path.join(__dirname, 'scavenger_hunt.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

db.serialize(() => {
    db.exec(sql, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Database setup completed');
        }
    });
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Closed the database connection.');
});
var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE Invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            due_date DATE,
            status TEXT
            )`,
            (err) => {
                if (err) {
                    // Invoices table already created
                    console.log('Invoices')
                } else {
                    // try to create the invoices items (Items) table
                    db.run(`CREATE TABLE Items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    description text,
                    price INTEGER,
                    invoiceId INTEGER,
                    CONSTRAINT invoices
                        FOREIGN KEY(invoiceId) REFERENCES Invoices(id) ON DELETE CASCADE
                    )`,
                        (err) => {
                            if (err) {
                                // Items table already created
                                console.log('Items')
                            }
                        });
                }
            });
    }
});


module.exports = db
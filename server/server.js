// Create express app
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var db = require('./database.js');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Server port
var HTTP_PORT = process.env.PORT || 8000;
// Start server
app.listen(HTTP_PORT, () => {
    console.log('Server running on port %PORT%'.replace('%PORT%', HTTP_PORT));
});
// Root endpoint
app.get('/', (req, res, next) => {
    res.json({ message: 'Ok' });
});

// Routes
app.get('/api/invoices', (req, res, next) => {
    var sql = 'select * from Invoices';
    var params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows,
        });
    });
});

app.post('/api/invoices', (req, res, next) => {
    var errors = [];
    if (!req.body.name) {
        errors.push('No invoice name specified');
    }
    if (!req.body.due_date) {
        errors.push('No due_date specified');
    }
    if (!req.body.status) {
        errors.push('No invoice status specified');
    }
    if (errors.length) {
        res.status(400).json({ error: errors.join(',') });
        return;
    }
    var data = {
        name: req.body.name,
        due_date: req.body.due_date,
        status: req.body.status,
    };
    var sql = 'INSERT INTO Invoices (name, due_date, status) VALUES (?,?,?)';
    var params = [data.name, data.due_date, data.status];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: data,
            id: this.lastID,
        });
    });
});

app.post('/api/invoices/:id', (req, res, next) => {
    var errors = [];
    if (!req.body.name) {
        errors.push('No invoice name specified');
    }
    if (!req.body.due_date) {
        errors.push('No due_date specified');
    }
    if (!req.body.status) {
        errors.push('No invoice status specified');
    }
    if (errors.length) {
        res.status(400).json({ error: errors.join(',') });
        return;
    }
    var data = {
        name: req.body.name,
        due_date: req.body.due_date,
        status: req.body.status,
    };
    var sql = 'UPDATE Invoices set name = COALESCE(?,name), due_date = COALESCE(?,due_date), status = COALESCE(?,status) WHERE id= ?';
    var params = [data.name, data.due_date, data.status, req.params.id];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: data,
            changes: this.changes,
        });
    });
});

app.post('/api/items', (req, res, next) => {
    var errors = [];
    if (!req.body.description) {
        errors.push('No description specified');
    }
    if (!req.body.price) {
        errors.push('No price specified');
    }
    if (!req.body.invoiceId) {
        errors.push('No invoice specified');
    }
    if (errors.length) {
        res.status(400).json({ error: errors.join(',') });
        return;
    }
    var data = {
        description: req.body.description,
        invoiceId: req.body.invoiceId,
        price: req.body.price,
    };
    var sql = 'INSERT INTO Items (description, price, invoiceId) VALUES (?,?,?)';
    var params = [data.description, data.price, data.invoiceId];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            console.log(err, err.message)
            return;
        }
        res.json({
            message: 'success',
            data: data,
            id: this.lastID,
        });
    });
});

app.post('/api/items/:id', (req, res, next) => {
    var errors = [];
    if (!req.body.description) {
        errors.push('No description specified');
    }
    if (!req.body.price) {
        errors.push('No price specified');
    }
    if (!req.body.invoiceId) {
        errors.push('No invoice specified');
    }
    if (errors.length) {
        res.status(400).json({ error: errors.join(',') });
        return;
    }
    var data = {
        description: req.body.description,
        invoiceId: req.body.invoiceId,
        price: req.body.price,
    };
    var sql = 'UPDATE Items set description = COALESCE(?,description), price = COALESCE(?,price), invoiceId = COALESCE(?,invoiceId) WHERE id = ?';
    var params = [data.description, data.price, data.invoiceId, req.params.id];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            console.log(err, err.message)
            return;
        }
        res.json({
            message: 'success',
            data: data,
            changes: this.changes,
        });
    });
});

app.get('/api/items/invoice/:id', (req, res, next) => {
    var sql = 'select * from Items where invoiceId = ?';
    var params = [req.params.id];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows,
        });
    });
});

app.get('/api/invoices/:id', (req, res, next) => {
    var sql = 'select * from Invoices where id = ?';
    var params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row,
        });
    });
});

app.delete('/api/invoices/:id', (req, res, next) => {
    var sql = `PRAGMA foreign_keys = ON;delete from Invoices where id = ${req.params.id}`;
    db.exec(sql, (err, row) => {
        console.log(req.params.id);
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
        });
    });
});

app.delete('/api/items/:id', (req, res, next) => {
    var sql = `delete from Items where id = ${req.params.id}`;
    db.exec(sql, (err, row) => {
        console.log(req.params.id);
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
        });
    });
});

// Default response for any other request
app.use((req, res) => {
    res.status(404);
});
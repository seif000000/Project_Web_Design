const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    // Create
    router.post('/books', (req, res) => {
        const { title, author, description, price, category_id, image_url } = req.body;
        const sql = 'INSERT INTO Books (title, author, description, price, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [title, author, description, price, category_id, image_url], (err, result) => {
            if(err) return res.status(500).send(err);
            res.json({ message: 'Book added!', id: result.insertId });
        });
    });

    // Read
    router.get('/books', (req, res) => {
        db.query('SELECT * FROM Books', (err, results) => {
            if(err) return res.status(500).send(err);
            res.json(results);
        });
    });

    // Update
    router.put('/books/:id', (req, res) => {
        const { id } = req.params;
        const { title, author, description, price, category_id, image_url } = req.body;
        const sql = 'UPDATE Books SET title=?, author=?, description=?, price=?, category_id=?, image_url=? WHERE id=?';
        db.query(sql, [title, author, description, price, category_id, image_url, id], (err) => {
            if(err) return res.status(500).send(err);
            res.json({ message: 'Book updated!' });
        });
    });

    // Delete
    router.delete('/books/:id', (req, res) => {
        const { id } = req.params;
        db.query('DELETE FROM Books WHERE id=?', [id], (err) => {
            if(err) return res.status(500).send(err);
            res.json({ message: 'Book deleted!' });
        });
    });

    return router;
};

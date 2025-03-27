require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'auth_system'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('✅ Connected to MySQL');
    }
});

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.length > 0) return res.status(400).json({ error: 'User already exists' });

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
                [username, email, hashedPassword], 
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.status(201).json({ message: 'User registered successfully' });
                }
            );
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(400).json({ error: 'User not found' });

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

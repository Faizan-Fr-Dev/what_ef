const express = require('express');
// Trigger restart for DB refresh
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3008;

app.use(cors());
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Middleware to check if user is admin
// Expects 'x-user-id' header
const isAdmin = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    db.get("SELECT role FROM Users WHERE user_id = ?", [userId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(401).json({ error: 'User not found' });
        if (row.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
        next();
    });
};

// --- Subscribers ---
app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const subscribedAt = new Date().toISOString();
    db.run("INSERT INTO Subscribers (email, subscribed_at) VALUES (?, ?)", [email, subscribedAt], function (err) {
        if (err) {
            // Check for unique constraint violation (already subscribed)
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: "This email is already subscribed." });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Successfully subscribed!" });
    });
});

// --- Users ---
// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    db.get("SELECT * FROM Users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        if (bcrypt.compareSync(password, user.password)) {
            // Exclude password from response
            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

// Register
app.post('/api/register', async (req, res) => {
    const { name, email, password, country } = req.body;

    if (!name || !email || !password || !country) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    db.get("SELECT * FROM Users WHERE email = ?", [email], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.status(400).json({ error: "User already exists" });

        const hash = bcrypt.hashSync(password, 10);
        db.run("INSERT INTO Users (name, email, password, country, role, total_purchases) VALUES (?, ?, ?, ?, 'user', 0)", [name, email, hash, country], function (err) {
            if (err) return res.status(500).json({ error: err.message });

            // Return new user (excluding password)
            db.get("SELECT user_id, name, email, country, role, total_purchases FROM Users WHERE user_id = ?", [this.lastID], (err, newUser) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(newUser);
            });
        });
    });
});

// Guest Login
app.post('/api/guest-login', (req, res) => {
    const { name, email, country } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    // Check if user exists
    db.get("SELECT * FROM Users WHERE email = ?", [email], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        if (row) {
            // User exists, check role
            if (row.role !== 'guest') {
                return res.status(400).json({ error: "This email is already associated with a registered account. Please log in with your password instead." });
            }
            const { password, ...userWithoutPassword } = row;
            return res.json(userWithoutPassword);
        }

        // Create new guest user
        db.run("INSERT INTO Users (name, email, country, role, total_purchases) VALUES (?, ?, ?, 'guest', 0)", [name || 'Guest User', email, country || 'Unknown'], function (err) {
            if (err) return res.status(500).json({ error: err.message });

            db.get("SELECT user_id, name, email, country, role, total_purchases FROM Users WHERE user_id = ?", [this.lastID], (err, newUser) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(newUser);
            });
        });
    });
});

// Admin: User Management
app.get('/api/admin/users', isAdmin, (req, res) => {
    db.all("SELECT * FROM Users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.delete('/api/admin/users/:id', isAdmin, (req, res) => {
    db.run("DELETE FROM Users WHERE user_id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User deleted", changes: this.changes });
    });
});

app.put('/api/admin/users/:id/role', isAdmin, (req, res) => {
    const { role } = req.body;
    db.run("UPDATE Users SET role = ? WHERE user_id = ?", [role, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Role updated", changes: this.changes });
    });
});


// --- Comics ---
app.get('/api/comics', (req, res) => {
    db.all("SELECT * FROM Comics", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Admin: Comics CRUD
app.post('/api/comics', isAdmin, (req, res) => {
    const { title, description, release_date, price, bundle_id, cover_url, gumroad_link } = req.body;
    db.run("INSERT INTO Comics (title, description, release_date, price, bundle_id, cover_url, sales_count, gumroad_link) VALUES (?, ?, ?, ?, ?, ?, 0, ?)", [title, description, release_date, price, bundle_id, cover_url, gumroad_link], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ comic_id: this.lastID, ...req.body });
    });
});

app.put('/api/comics/:id', isAdmin, (req, res) => {
    const { title, description, release_date, price, bundle_id, cover_url, gumroad_link } = req.body;
    db.run("UPDATE Comics SET title=?, description=?, release_date=?, price=?, bundle_id=?, cover_url=?, gumroad_link=? WHERE comic_id=?", [title, description, release_date, price, bundle_id, cover_url, gumroad_link, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Comic updated", changes: this.changes });
    });
});

app.delete('/api/comics/:id', isAdmin, (req, res) => {
    db.run("DELETE FROM Comics WHERE comic_id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Comic deleted", changes: this.changes });
    });
});


// --- Polls ---
app.get('/api/polls', (req, res) => {
    const { userId } = req.query;

    db.all("SELECT * FROM FanPolls", [], (err, polls) => {
        if (err) return res.status(500).json({ error: err.message });

        db.all("SELECT * FROM FanPollOptions", [], (err, options) => {
            if (err) return res.status(500).json({ error: err.message });

            // If userId provided, fetch their votes
            if (userId) {
                db.all("SELECT poll_id, option_id FROM FanPollVotes WHERE user_id = ?", [userId], (err, votes) => {
                    if (err) return res.status(500).json({ error: err.message });

                    const userVotes = {}; // poll_id -> option_id
                    votes.forEach(v => userVotes[v.poll_id] = v.option_id);

                    const pollsWithOptions = polls.map(p => ({
                        ...p,
                        options: options.filter(o => o.poll_id === p.poll_id),
                        user_vote: userVotes[p.poll_id] || null
                    }));
                    res.json(pollsWithOptions);
                });
            } else {
                const pollsWithOptions = polls.map(p => ({
                    ...p,
                    options: options.filter(o => o.poll_id === p.poll_id)
                }));
                res.json(pollsWithOptions);
            }
        });
    });
});

app.post('/api/polls/vote', (req, res) => {
    const { pollId, optionId, userId } = req.body;

    // Check if user already voted
    db.get("SELECT * FROM FanPollVotes WHERE poll_id = ? AND user_id = ?", [pollId, userId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.status(400).json({ error: "You have already voted in this poll." });

        const voteDate = new Date().toISOString();

        // Record the vote
        db.run("INSERT INTO FanPollVotes (poll_id, user_id, option_id, vote_date) VALUES (?, ?, ?, ?)", [pollId, userId, optionId, voteDate], function (err) {
            if (err) return res.status(500).json({ error: err.message });

            // Increment vote count
            db.run("UPDATE FanPollOptions SET vote_count = vote_count + 1 WHERE option_id = ? AND poll_id = ?", [optionId, pollId], function (err) {
                if (err) return res.status(500).json({ error: err.message });

                // Return updated poll
                db.get("SELECT * FROM FanPolls WHERE poll_id = ?", [pollId], (err, poll) => {
                    if (err) return res.status(500).json({ error: err.message });

                    db.all("SELECT * FROM FanPollOptions WHERE poll_id = ?", [pollId], (err, options) => {
                        if (err) return res.status(500).json({ error: err.message });

                        res.json({ ...poll, options, user_vote: optionId });
                    });
                });
            });
        });
    });
});

// Admin: Polls CRUD
app.post('/api/polls', isAdmin, (req, res) => {
    const { question, start_date, end_date, options } = req.body; // options is array of strings

    db.run("INSERT INTO FanPolls (question, start_date, end_date, status) VALUES (?, ?, ?, 'active')", [question, start_date, end_date], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        const pollId = this.lastID;

        if (!options || options.length === 0) {
            return res.json({ poll_id: pollId, message: "Poll created with no options" });
        }

        const insertOption = (index) => {
            if (index >= options.length) {
                return res.json({ poll_id: pollId, message: "Poll created" });
            }
            db.run("INSERT INTO FanPollOptions (poll_id, option_text, vote_count) VALUES (?, ?, 0)", [pollId, options[index]], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                insertOption(index + 1);
            });
        };
        insertOption(0);
    });
});

app.put('/api/polls/:id', isAdmin, (req, res) => {
    const { status } = req.body;
    db.run("UPDATE FanPolls SET status = ? WHERE poll_id = ?", [status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Poll updated", changes: this.changes });
    });
});

app.delete('/api/polls/:id', isAdmin, (req, res) => {
    db.serialize(() => {
        db.run("DELETE FROM FanPollOptions WHERE poll_id = ?", [req.params.id]);
        db.run("DELETE FROM FanPollVotes WHERE poll_id = ?", [req.params.id]);
        db.run("DELETE FROM FanPolls WHERE poll_id = ?", [req.params.id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Poll deleted" });
        });
    });
});


// --- Bundles ---
app.get('/api/bundles', (req, res) => {
    db.all("SELECT * FROM SeriesBundles", [], (err, bundles) => {
        if (err) return res.status(500).json({ error: err.message });

        db.all("SELECT * FROM Comics WHERE bundle_id IS NOT NULL", [], (err, comics) => {
            if (err) return res.status(500).json({ error: err.message });

            const bundlesWithComics = bundles.map(bundle => {
                const bundleComics = comics.filter(c => c.bundle_id === bundle.bundle_id);
                return { ...bundle, comics: bundleComics };
            });
            res.json(bundlesWithComics);
        });
    });
});

app.get('/api/bundles/:id', (req, res) => {
    db.get("SELECT * FROM SeriesBundles WHERE bundle_id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row || null);
    });
});

app.get('/api/bundles/:id/comics', (req, res) => {
    db.all("SELECT * FROM Comics WHERE bundle_id = ?", [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Admin: Bundles CRUD
app.post('/api/bundles', isAdmin, (req, res) => {
    const { bundle_name, description, discount_percent } = req.body;
    db.run("INSERT INTO SeriesBundles (bundle_name, description, discount_percent, total_sales) VALUES (?, ?, ?, 0)", [bundle_name, description, discount_percent], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ bundle_id: this.lastID, ...req.body });
    });
});

app.put('/api/bundles/:id', isAdmin, (req, res) => {
    const { bundle_name, description, discount_percent } = req.body;
    db.run("UPDATE SeriesBundles SET bundle_name=?, description=?, discount_percent=? WHERE bundle_id=?", [bundle_name, description, discount_percent, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Bundle updated", changes: this.changes });
    });
});

app.delete('/api/bundles/:id', isAdmin, (req, res) => {
    db.run("DELETE FROM SeriesBundles WHERE bundle_id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Bundle deleted", changes: this.changes });
    });
});


// --- Custom Editions ---
app.get('/api/custom-editions', (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    db.all(`
        SELECT ce.*, 
               c.comic_id as c_comic_id, c.title as c_title, c.description as c_description, 
               c.release_date as c_release_date, c.price as c_price, c.bundle_id as c_bundle_id, 
               c.cover_url as c_cover_url, c.sales_count as c_sales_count, c.gumroad_link as c_gumroad_link
        FROM CustomEditions ce
        LEFT JOIN Comics c ON ce.comic_id = c.comic_id
        WHERE ce.user_id = ?
    `, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(mapCustomEditions(rows));
    });
});

app.post('/api/custom-editions', (req, res) => {
    const { userId, comicId, customName, avatarReference } = req.body;

    const requestDate = new Date().toISOString();
    const deliveryStatus = 'pending';

    db.run("INSERT INTO CustomEditions (user_id, comic_id, custom_name, avatar_reference, request_date, delivery_status) VALUES (?, ?, ?, ?, ?, ?)", [userId, comicId, customName, avatarReference, requestDate, deliveryStatus], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        const newId = this.lastID;

        db.get(`
            SELECT ce.*, 
               c.comic_id as c_comic_id, c.title as c_title, c.description as c_description, 
               c.release_date as c_release_date, c.price as c_price, c.bundle_id as c_bundle_id, 
               c.cover_url as c_cover_url, c.sales_count as c_sales_count, c.gumroad_link as c_gumroad_link
            FROM CustomEditions ce
            LEFT JOIN Comics c ON ce.comic_id = c.comic_id
            WHERE ce.edition_id = ?
        `, [newId], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(mapCustomEditions([row])[0]);
        });
    });
});

// Admin: Custom Editions Management
app.get('/api/admin/custom-editions', isAdmin, (req, res) => {
    db.all(`
        SELECT ce.*, 
               c.comic_id as c_comic_id, c.title as c_title, c.description as c_description, 
               c.release_date as c_release_date, c.price as c_price, c.bundle_id as c_bundle_id, 
               c.cover_url as c_cover_url, c.sales_count as c_sales_count, c.gumroad_link as c_gumroad_link,
               u.name as user_name, u.email as user_email
        FROM CustomEditions ce
        LEFT JOIN Comics c ON ce.comic_id = c.comic_id
        LEFT JOIN Users u ON ce.user_id = u.user_id
    `, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(mapCustomEditions(rows));
    });
});

app.put('/api/admin/custom-editions/:id', isAdmin, (req, res) => {
    const { delivery_status } = req.body;
    db.run("UPDATE CustomEditions SET delivery_status = ? WHERE edition_id = ?", [delivery_status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Status updated", changes: this.changes });
    });
});

function mapCustomEditions(rows) {
    return rows.map(row => {
        const {
            c_comic_id, c_title, c_description, c_release_date, c_price,
            c_bundle_id, c_cover_url, c_sales_count, c_gumroad_link,
            user_name, user_email,
            ...edition
        } = row;
        return {
            ...edition,
            user: user_name ? { name: user_name, email: user_email } : undefined,
            comic: c_comic_id ? {
                comic_id: c_comic_id,
                title: c_title,
                description: c_description,
                release_date: c_release_date,
                price: c_price,
                bundle_id: c_bundle_id,
                cover_url: c_cover_url,
                sales_count: c_sales_count,
                gumroad_link: c_gumroad_link
            } : null
        };
    });
}

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Backend server ready on port ${PORT}`);
    });
}

module.exports = app;

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbPath = path.resolve(__dirname, './database/database.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const bcrypt = require('bcryptjs');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Users
        db.run(`CREATE TABLE IF NOT EXISTS Users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            password TEXT,
            country TEXT,
            role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin', 'guest')),
            total_purchases INTEGER DEFAULT 0
        )`);

        // Comics
        // NOTE: Retaining gumroad_link to satisfy SRS requirement 3.2.2 FR6 and frontend compatibility, 
        // even though it was missing from the provided Schema.md snippet.
        db.run(`CREATE TABLE IF NOT EXISTS Comics (
            comic_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            release_date TEXT,
            price REAL,
            bundle_id INTEGER,
            cover_url TEXT,
            sales_count INTEGER DEFAULT 0,
            gumroad_link TEXT
        )`);

        // SeriesBundles
        db.run(`CREATE TABLE IF NOT EXISTS SeriesBundles (
            bundle_id INTEGER PRIMARY KEY AUTOINCREMENT,
            bundle_name TEXT,
            description TEXT,
            discount_percent REAL,
            total_sales INTEGER DEFAULT 0
        )`);

        // FanPolls
        db.run(`CREATE TABLE IF NOT EXISTS FanPolls (
            poll_id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT,
            start_date TEXT,
            end_date TEXT,
            status TEXT CHECK(status IN ('active', 'closed'))
        )`);

        // FanPollOptions
        db.run(`CREATE TABLE IF NOT EXISTS FanPollOptions (
            option_id INTEGER PRIMARY KEY AUTOINCREMENT,
            poll_id INTEGER,
            option_text TEXT,
            vote_count INTEGER DEFAULT 0,
            FOREIGN KEY(poll_id) REFERENCES FanPolls(poll_id)
        )`);

        // FanPollVotes
        db.run(`CREATE TABLE IF NOT EXISTS FanPollVotes (
            vote_id INTEGER PRIMARY KEY AUTOINCREMENT,
            poll_id INTEGER,
            user_id INTEGER,
            option_id INTEGER,
            vote_date TEXT,
            FOREIGN KEY(poll_id) REFERENCES FanPolls(poll_id),
            FOREIGN KEY(user_id) REFERENCES Users(user_id),
            FOREIGN KEY(option_id) REFERENCES FanPollOptions(option_id)
        )`);

        // CustomEditions
        db.run(`CREATE TABLE IF NOT EXISTS CustomEditions (
            edition_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            comic_id INTEGER,
            custom_name TEXT,
            avatar_reference TEXT,
            request_date TEXT,
            delivery_status TEXT CHECK(delivery_status IN ('pending', 'in_progress', 'delivered')),
            FOREIGN KEY(user_id) REFERENCES Users(user_id),
            FOREIGN KEY(comic_id) REFERENCES Comics(comic_id)
        )`);

        // Subscribers
        db.run(`CREATE TABLE IF NOT EXISTS Subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            subscribed_at TEXT
        )`);

        seedData();
    });
}

function seedData() {
    // Check if Users empty, if so seed.
    db.get("SELECT count(*) as count FROM Users", [], (err, row) => {
        if (err) {
            console.error(err);
            return;
        }
        if (row.count === 0) {
            console.log("Seeding data...");
            const hash = bcrypt.hashSync('password123', 10);

            const stmtUser = db.prepare("INSERT INTO Users (name, email, password, country, role) VALUES (?, ?, ?, ?, ?)");
            stmtUser.run("Admin User", "admin@whatef.com", hash, "USA", "admin");
            stmtUser.run("John Doe", "john@example.com", hash, "USA", "user");
            stmtUser.run("Jane Smith", "jane@example.com", hash, "Canada", "user");
            stmtUser.finalize();

            // Seed Bundles first
            const bundles = [
                [1, 'Galactic Saga Pack', 'The first two epic space adventures!', 15.00, 300],
                [2, 'Cyberpunk Collection', 'Explore the gritty futures of Cyber City and Neo-Tokyo.', 20.00, 550]
            ];
            const bundleStmt = db.prepare("INSERT INTO SeriesBundles VALUES (?, ?, ?, ?, ?)");
            bundles.forEach(b => bundleStmt.run(b));
            bundleStmt.finalize();

            // Seed Comics
            const comics = [
                [1, 'What Ef? Strange Things Happened Inside One Mind', 'A child’s mind becomes a fractured universe where fear creates monsters. Shifting cities, impossible physics, and shadowy creatures stalk every thought.', '2023-10-01', 5.99, null, 'https://public-files.gumroad.com/xgv2vpc3mlnwv3qap93jn7r80zpi', 120, 'https://whatef.gumroad.com/l/what-ef-strange-things-one-mind'],
                [2, 'What If? One Idiot Survived All Games.', 'Deadly games. Perfect systems. One clueless contestant—and his teddy. Rules collapse when logic meets chaos. A darkly humorous survival story.', '2023-11-15', 5.99, null, 'https://public-files.gumroad.com/gd0jk76wn2dj8bs0dcap67853ohs', 85, 'https://whatef.gumroad.com/l/what-ef-idiot-survived-all-games'],
                [3, 'What Ef? The First Digital Heist', 'In a world where money no longer exists, a heist targets the system itself. Digital vaults, silent wars, and a mastermind rewriting reality through code.', '2024-01-10', 5.99, null, 'https://public-files.gumroad.com/j0qj6vbo0nn8ih4xsmgclex1ioum', 200, 'https://whatef.gumroad.com/l/what-ef-first-digital-heist'],
                [4, 'What Ef? The Librarian Who Read Too Much', 'In a forbidden library where books alter reality, one librarian reads without breaking. A dark, gothic story about obsession, power, and forbidden knowledge.', '2024-02-28', 5.99, null, 'https://public-files.gumroad.com/9d4qy51f5s7ndt33d8e4k39sc9xj', 95, 'https://whatef.gumroad.com/l/what-ef-librarian-read-too-much'],
                [5, 'What Ef? Friends in a Zombie Apocalypse', 'A mysterious outbreak traps six friends inside an infected city. With improvised weapons, constant bickering, and unbreakable friendship, survival becomes absurdly entertaining.', '2024-03-15', 5.99, null, 'https://public-files.gumroad.com/8nt11yi7dsp64kusz6cyqfyjyqcx', 150, 'https://whatef.gumroad.com/l/what-ef-friends-zombie-apocalypse']
            ];
            const comicStmt = db.prepare("INSERT INTO Comics VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            comics.forEach(c => comicStmt.run(c));
            comicStmt.finalize();

            // Seed FanPolls
            const polls = [
                [1, 'Which new series is your favorite?', '2023-06-01', '2023-06-30', 'active'],
                [2, 'What should happen in the next issue of Neon Ronin?', '2023-11-05', '2023-11-20', 'active'],
                [3, 'Should we revive the antagonist from Quantum Quest?', '2023-02-01', '2023-02-28', 'closed']
            ];
            const pollStmt = db.prepare("INSERT INTO FanPolls VALUES (?, ?, ?, ?, ?)");
            polls.forEach(p => pollStmt.run(p));
            pollStmt.finalize();

            // Seed FanPollOptions
            const options = [
                [1, 1, 'Quantum Quest', 150],
                [2, 1, 'Starlight Saber', 250],
                [3, 1, 'Cyber City Blues', 100],
                [4, 2, 'A heroic sacrifice', 45],
                [5, 2, 'A shocking betrayal', 95],
                [6, 3, 'Yes, bring back the villain!', 200],
                [7, 3, 'No, let the story move on.', 50]
            ];
            const optStmt = db.prepare("INSERT INTO FanPollOptions VALUES (?, ?, ?, ?)");
            options.forEach(o => optStmt.run(o));
            optStmt.finalize();

            // Seed CustomEditions
            const editions = [
                [1, 1, 3, 'Alex in Cyber City', 'https://i.pravatar.cc/150?u=alex', '2023-10-15T10:00:00Z', 'delivered'],
                [2, 1, 1, 'Quantum Alex', '', '2023-11-20T14:30:00Z', 'in_progress']
            ];
            const edStmt = db.prepare("INSERT INTO CustomEditions VALUES (?, ?, ?, ?, ?, ?, ?)");
            editions.forEach(e => edStmt.run(e));
            edStmt.finalize();

            console.log("Seeding complete.");
        }
    });

}

module.exports = db;

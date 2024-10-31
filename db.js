// db.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// const sqlite3 = require('sqlite3').verbose(); // Verbose mode provides additional debugging information
// const db = new sqlite3.Database('./task_manager.db');


// db.serialize(() => {
//     // Create Users table
//     db.run(`
//         CREATE TABLE IF NOT EXISTS Users (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             email TEXT NOT NULL UNIQUE
//         )
//     `);

//     // Create Tasks table
//     db.run(`
//         CREATE TABLE IF NOT EXISTS Tasks (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             title TEXT NOT NULL,
//             description TEXT,
//             status TEXT CHECK(status IN ('Active', 'Snoozed', 'Completed')) DEFAULT 'Active',
//             created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//             updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
//         )
//     `);

//     // Create TaskMessages table
//     db.run(`
//         CREATE TABLE IF NOT EXISTS TaskMessages (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             task_id INTEGER NOT NULL,
//             user_id INTEGER NOT NULL,
//             message TEXT NOT NULL,
//             timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
//             FOREIGN KEY (task_id) REFERENCES Tasks(id),
//             FOREIGN KEY (user_id) REFERENCES Users(id)
//         )
//     `);

//     // Create TaskAssignments table
//     db.run(`
//         CREATE TABLE IF NOT EXISTS TaskAssignments (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             task_id INTEGER NOT NULL,
//             user_id INTEGER NOT NULL,
//             FOREIGN KEY (task_id) REFERENCES Tasks(id),
//             FOREIGN KEY (user_id) REFERENCES Users(id)
//         )
//     `);
// });

// module.exports = db;



// // Test functions below this point
// function testDatabase() {
//     // Insert a sample user
//     db.run("INSERT INTO Users (name, email) VALUES (?, ?)", ["Alice", "alice@example.com"], function (err) {
//         if (err) {
//             console.error("Error inserting user:", err.message);
//         } else {
//             console.log("Sample user added with ID:", this.lastID);
//         }
//     });

//     // Insert a sample task
//     db.run("INSERT INTO Tasks (title, description) VALUES (?, ?)", ["Sample Task", "This is a test task"], function (err) {
//         if (err) {
//             console.error("Error inserting task:", err.message);
//         } else {
//             console.log("Sample task added with ID:", this.lastID);
//         }
//     });
// }

// Uncomment to run test
// testDatabase();
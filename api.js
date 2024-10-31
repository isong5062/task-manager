// src/api.js
import { supabase } from './db';

// Create a new task
export const createTask = async (title, description, status = 'Active') => {
  const { data, error } = await supabase
    .from('Tasks')
    .insert([{ title, description, status }]);
  
  if (error) throw error;
  return data;
};

// Fetch all tasks
export const fetchTasks = async () => {
  const { data, error } = await supabase
    .from('Tasks')
    .select('*');
  
  if (error) throw error;
  return data;
};

// Fetch a specific task by ID
export const fetchTaskById = async (taskId) => {
  const { data, error } = await supabase
    .from('Tasks')
    .select('*')
    .eq('id', taskId)
    .single();
  
  if (error) throw error;
  return data;
};

// Update a task's status or details
export const updateTask = async (taskId, updates) => {
  const { data, error } = await supabase
    .from('Tasks')
    .update(updates)
    .eq('id', taskId);
  
  if (error) throw error;
  return data;
};

// Delete a task
export const deleteTask = async (taskId) => {
  const { data, error } = await supabase
    .from('Tasks')
    .delete()
    .eq('id', taskId);
  
  if (error) throw error;
  return data;
};

// Create a new message for a task
export const createMessage = async (taskId, userId, message) => {
  const { data, error } = await supabase
    .from('TaskMessages')
    .insert([{ task_id: taskId, user_id: userId, message }]);
  
  if (error) throw error;
  return data;
};

// Fetch all messages for a task
export const fetchMessagesByTaskId = async (taskId) => {
  const { data, error } = await supabase
    .from('TaskMessages')
    .select('*, Users(name)')
    .eq('task_id', taskId)
    .order('timestamp', { ascending: true });
  
  if (error) throw error;
  return data;
};

// Assign a user to a task
export const assignUserToTask = async (taskId, userId) => {
  const { data, error } = await supabase
    .from('TaskAssignments')
    .insert([{ task_id: taskId, user_id: userId }]);
  
  if (error) throw error;
  return data;
};

// Fetch all users assigned to a task
export const fetchUsersByTaskId = async (taskId) => {
  const { data, error } = await supabase
    .from('TaskAssignments')
    .select('Users(id, name, email)')
    .eq('task_id', taskId);
  
  if (error) throw error;
  return data;
};

// Fetch all users
export const fetchAllUsers = async () => {
  const { data, error } = await supabase
    .from('Users')
    .select('*');
  
  if (error) throw error;
  return data;
};


// const express = require('express');
// const db = require('./db'); // Import the database from db.js
// const app = express();
// const cors = require('cors'); // Import CORS

// app.use(cors()); // Enable CORS for all routes
// app.use(express.json()); // Middleware to parse JSON request bodies

// // Start the server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// // Create a task
// app.post('/tasks', (req, res) => {
//     const { title, description, status } = req.body;
//     const query = `
//         INSERT INTO Tasks (title, description, status, created_at, updated_at)
//         VALUES (?, ?, ?, datetime('now'), datetime('now'))
//     `;
//     db.run(query, [title, description, status || 'Active'], function (err) {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.status(201).json({ id: this.lastID });
//     });
// });

// // Get all tasks
// app.get('/tasks', (req, res) => {
//     db.all('SELECT * FROM Tasks', (err, rows) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.json(rows);
//     });
// });

// // Retrieve a specific task by ID
// app.get('/tasks/:id', (req, res) => {
//     const { id } = req.params;
//     db.get('SELECT * FROM Tasks WHERE id = ?', [id], (err, row) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         if (!row) {
//             res.status(404).json({ error: 'Task not found' });
//             return;
//         }
//         res.json(row);
//     });
// });

// // Update a task's status
// app.put('/tasks/:id', (req, res) => {
//     const { id } = req.params;
//     const { title, description, status } = req.body;

//     // Validate the status field if it exists
//     const validStatuses = ['Active', 'Snoozed', 'Completed'];
//     if (status && !validStatuses.includes(status)) {
//         return res.status(400).json({ error: 'Invalid status' });
//     }

//     const query = `
//         UPDATE Tasks
//         SET title = COALESCE(?, title),
//             description = COALESCE(?, description),
//             status = COALESCE(?, status),
//             updated_at = datetime('now')
//         WHERE id = ?
//     `;

//     db.run(query, [title, description, status, id], function (err) {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         if (this.changes === 0) {
//             res.status(404).json({ error: 'Task not found' });
//             return;
//         }
//         res.json({ message: 'Task updated successfully', changes: this.changes });
//     });
// });

// // Delete a task
// app.delete('/tasks/:id', (req, res) => {
//     const { id } = req.params;
//     db.run('DELETE FROM Tasks WHERE id = ?', [id], function (err) {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.json({ message: 'Task deleted', changes: this.changes });
//     });
// });

// // Create a new message for a task
// app.post('/tasks/:taskId/messages', (req, res) => {
//     const { taskId } = req.params;
//     const { user_id, message } = req.body;

//     const query = `
//         INSERT INTO TaskMessages (task_id, user_id, message, timestamp)
//         VALUES (?, ?, ?, datetime('now'))
//     `;
//     db.run(query, [taskId, user_id, message], function (err) {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.status(201).json({ id: this.lastID });
//     });
// });

// // Retrieve all messages for a task
// app.get('/tasks/:taskId/messages', (req, res) => {
//     const { taskId } = req.params;
//     const query = `
//         SELECT TaskMessages.id, TaskMessages.message, TaskMessages.timestamp, Users.name AS user_name
//         FROM TaskMessages
//         JOIN Users ON TaskMessages.user_id = Users.id
//         WHERE TaskMessages.task_id = ?
//         ORDER BY TaskMessages.timestamp ASC
//     `;
//     db.all(query, [taskId], (err, rows) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.json(rows);
//     });
// });

// // Assign a user to a task
// app.post('/tasks/:taskId/assign', (req, res) => {
//     const { taskId } = req.params;
//     const { user_id } = req.body;

//     const query = `
//         INSERT INTO TaskAssignments (task_id, user_id)
//         VALUES (?, ?)
//     `;
//     db.run(query, [taskId, user_id], function (err) {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.status(201).json({ id: this.lastID });
//     });
// });

// // Retrieve all users assigned to a task
// app.get('/tasks/:taskId/assign', (req, res) => {
//     const { taskId } = req.params;
//     const query = `
//         SELECT Users.id, Users.name, Users.email
//         FROM TaskAssignments
//         JOIN Users ON TaskAssignments.user_id = Users.id
//         WHERE TaskAssignments.task_id = ?
//     `;
//     db.all(query, [taskId], (err, rows) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.json(rows);
//     });
// });

// // Retrieve all users
// app.get('/users', (req, res) => {
//     db.all('SELECT * FROM Users', (err, rows) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.json(rows);
//     });
// });


// module.exports = app;

// src/api.js

import { supabase } from './db';

/**
 * API Functions
 * -------------
 * This file contains functions to interact with the Supabase database.
 * Each function performs a specific operation (CRUD) for tasks, task messages,
 * and user assignments in the task management system.
 * Functions throw errors if any operation fails, which should be handled by the caller.
 */

/**
 * Creates a new task in the database.
 * @param {string} title - The title of the task.
 * @param {string} description - Detailed description of the task.
 * @param {string} [status='Active'] - Initial status of the task (default: 'Active').
 * @returns {Promise<Object>} - The created task data.
 * @throws {Error} - Throws an error if task creation fails.
 */
export const createTask = async (title, description, status = 'Active') => {
  const { data, error } = await supabase
    .from('Tasks')
    .insert([{ title, description, status }]);

  if (error) throw error;
  return data;
};

/**
 * Fetches all tasks from the database.
 * @returns {Promise<Array>} - List of all tasks.
 * @throws {Error} - Throws an error if fetching tasks fails.
 */
export const fetchTasks = async () => {
  const { data, error } = await supabase.from('Tasks').select('*');
  if (error) throw error;
  return data;
};

/**
 * Fetches a specific task by its ID.
 * @param {number} taskId - ID of the task to fetch.
 * @returns {Promise<Object>} - The fetched task data.
 * @throws {Error} - Throws an error if fetching the task fails.
 */
export const fetchTaskById = async (taskId) => {
  const { data, error } = await supabase
    .from('Tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Updates a task's details.
 * @param {number} taskId - ID of the task to update.
 * @param {Object} updates - Object containing fields to update.
 * @returns {Promise<Object>} - Updated task data.
 * @throws {Error} - Throws an error if updating the task fails.
 */
export const updateTask = async (taskId, updates) => {
  const { data, error } = await supabase
    .from('Tasks')
    .update(updates)
    .eq('id', taskId);

  if (error) throw error;
  return data;
};

/**
 * Deletes a task from the database.
 * @param {number} taskId - ID of the task to delete.
 * @returns {Promise<Object>} - Deleted task data.
 * @throws {Error} - Throws an error if deleting the task fails.
 */
export const deleteTask = async (taskId) => {
  const { data, error } = await supabase.from('Tasks').delete().eq('id', taskId);
  if (error) throw error;
  return data;
};

/**
 * Creates a new message associated with a specific task.
 * @param {number} taskId - ID of the task.
 * @param {number} userId - ID of the user sending the message.
 * @param {string} message - Content of the message.
 * @returns {Promise<Object>} - Created message data.
 * @throws {Error} - Throws an error if creating the message fails.
 */
export const createMessage = async (taskId, userId, message) => {
  const { data, error } = await supabase
    .from('TaskMessages')
    .insert([{ task_id: taskId, user_id: userId, message }]);

  if (error) throw error;
  return data;
};

/**
 * Fetches all messages for a specific task.
 * @param {number} taskId - ID of the task.
 * @returns {Promise<Array>} - List of messages for the task.
 * @throws {Error} - Throws an error if fetching messages fails.
 */
export const fetchMessagesByTaskId = async (taskId) => {
  const { data, error } = await supabase
    .from('TaskMessages')
    .select('*, Users(name)')
    .eq('task_id', taskId)
    .order('timestamp', { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * Assigns a user to a task.
 * @param {number} taskId - ID of the task.
 * @param {number} userId - ID of the user.
 * @returns {Promise<Object>} - Assignment data.
 * @throws {Error} - Throws an error if assigning the user fails.
 */
export const assignUserToTask = async (taskId, userId) => {
  const { data, error } = await supabase
    .from('TaskAssignments')
    .insert([{ task_id: taskId, user_id: userId }]);

  if (error) throw error;
  return data;
};

/**
 * Fetches all users assigned to a specific task.
 * @param {number} taskId - ID of the task.
 * @returns {Promise<Array>} - List of users assigned to the task.
 * @throws {Error} - Throws an error if fetching users fails.
 */
export const fetchUsersByTaskId = async (taskId) => {
  const { data, error } = await supabase
    .from('TaskAssignments')
    .select('Users(id, name, email)')
    .eq('task_id', taskId);

  if (error) throw error;
  return data;
};

/**
 * Fetches all users from the database.
 * @returns {Promise<Array>} - List of all users.
 * @throws {Error} - Throws an error if fetching users fails.
 */
export const fetchAllUsers = async () => {
  const { data, error } = await supabase.from('Users').select('*');
  if (error) throw error;
  return data;
};

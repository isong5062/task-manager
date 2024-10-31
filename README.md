This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Shared Task Manager

A collaborative task management web application designed for families to track and discuss shared tasks with integrated chat functionality. Users can create, assign, and communicate about tasks in real-time.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Backend API Endpoints](#backend-api-endpoints)
- [Technology Choices and Rationale](#technology-choices-and-rationale)
- [Assumptions Made](#assumptions-made)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/isong5062/task-manager.git
cd task-manager
```

### 2. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) installed, then run in the terminal:

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the project's root directory to configure your Supabase environment variables. Add the following:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project values, available in the [Supabase dashboard](https://app.supabase.io/).

### 4. Database Setup

Set up the following tables in your Supabase database by following these instructions:

1. **Access the SQL Editor**:
   - Go to your Supabase project dashboard.
   - In the left sidebar, select **SQL Editor**.
   - Open a new SQL query editor.

2. **Run the Following SQL Statements**:

   #### Users Table
   ```sql
   CREATE TABLE Users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       email VARCHAR(150) UNIQUE NOT NULL
   );
   ```

   #### Tasks Table
   ```sql
   CREATE TABLE Tasks (
       id SERIAL PRIMARY KEY,
       title VARCHAR(200) NOT NULL,
       description TEXT,
       status VARCHAR(20) CHECK (status IN ('Active', 'Snoozed', 'Completed')) DEFAULT 'Active',
       created_at TIMESTAMP DEFAULT NOW(),
       updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

   #### TaskMessages Table
   ```sql
   CREATE TABLE TaskMessages (
       id SERIAL PRIMARY KEY,
       task_id INT REFERENCES Tasks(id) ON DELETE CASCADE,
       user_id INT REFERENCES Users(id) ON DELETE SET NULL,
       message TEXT NOT NULL,
       timestamp TIMESTAMP DEFAULT NOW()
   );
   ```

   #### TaskAssignments Table
   ```sql
   CREATE TABLE TaskAssignments (
       id SERIAL PRIMARY KEY,
       task_id INT REFERENCES Tasks(id) ON DELETE CASCADE,
       user_id INT REFERENCES Users(id) ON DELETE CASCADE
   );
   ```


3. **Verify Table Creation**:
   After running each SQL statement, go to the **Table Editor** in Supabase to confirm the tables `Users`, `Tasks`, `TaskMessages`, and `TaskAssignments` were successfully created with the correct columns.

### Database Tables Overview

1. **Users Table**
   - **Purpose**: This table stores information about each user who has access to the task management app.
   - **Fields**:
     - `id`: The primary key that uniquely identifies each user.
     - `name`: The user's name, used to personalize the app experience.
     - `email`: The user's email address, used for identification and login purposes.

2. **Tasks Table**
   - **Purpose**: The `Tasks` table holds information about each task created within the app.
   - **Fields**:
     - `id`: The primary key for each task.
     - `title`: The name or short description of the task.
     - `description`: A detailed description of the task, which may include specific requirements or instructions.
     - `status`: Indicates the task's current state (`Active`, `Snoozed`, or `Completed`).
     - `created_at` and `updated_at`: Timestamps to track when the task was created and last updated.

3. **TaskMessages Table**
   - **Purpose**: This table stores messages related to specific tasks, enabling a chat-like feature for real-time collaboration.
   - **Fields**:
     - `id`: The primary key for each message.
     - `task_id`: A foreign key linking the message to a specific task in the `Tasks` table.
     - `user_id`: A foreign key linking the message to the user who posted it.
     - `message`: The content of the message.
     - `timestamp`: The time the message was created, used to order messages chronologically.

4. **TaskAssignments Table**
   - **Purpose**: This is a join table that links users to tasks, indicating which users are assigned to which tasks.
   - **Fields**:
     - `id`: The primary key for each assignment entry.
     - `task_id`: A foreign key linking to the task in the `Tasks` table.
     - `user_id`: A foreign key linking to the user in the `Users` table.

### 5. Run the Application

After setting up the database and environment variables, start the application in the terminal from your project's root folder:

```bash
npm run dev
```

The application should now be available at `http://localhost:3000`.

---

## Backend API Endpoints

The application’s backend API facilitates interactions with tasks, messages, and assignments. Here’s an overview of the primary endpoints:

1. **Task CRUD Operations**: 
   - **Create Task** (`POST /tasks`): Adds a new task to the database.
   - **Read All Tasks** (`GET /tasks`): Fetches a list of tasks, filtered by user.
   - **Read Specific Task** (`GET /tasks/:id`): Retrieves a task by its ID.
   - **Update Task** (`PUT /tasks/:id`): Updates a task’s title, description, or status.
   - **Delete Task** (`DELETE /tasks/:id`): Removes a task by its ID.

2. **Fetching Task Messages**:
   - **Get Task Messages** (`GET /tasks/:taskId/messages`): Retrieves all messages associated with a task, allowing real-time communication.

3. **Creating New Messages**:
   - **Post New Message** (`POST /tasks/:taskId/messages`): Adds a new message to the specified task’s chat, linking it to the `task_id` and `user_id`.

4. **Updating Task Status**:
   - **Update Task Status** (`PUT /tasks/:id/status`): Changes a task’s status to `Active`, `Snoozed`, or `Completed`.

5. **Task Assignment Management**:
   - **Assign User to Task** (`POST /tasks/:taskId/assign`): Assigns a user to a task by adding an entry in the `TaskAssignments` table.
   - **Fetch Assigned Users** (`GET /tasks/:taskId/users`): Retrieves all users associated with a specific task.

---

## Technology Choices and Rationale

- **Next.js**: Chosen for its optimized server-side rendering, efficient development workflow, and easy API integration.
- **Supabase**: Selected as a scalable, easy-to-use backend that offers a PostgreSQL database with RESTful API and real-time subscriptions.
- **Tailwind CSS**: Employed for rapid and responsive UI development with minimal custom CSS, ensuring a clean and scalable styling process.

## Design Decisions

- **Explicit Text on Buttons Alongside Icons**: The decision to include explicit text on buttons rather than relying solely on icons was aimed at making the app intuitive for all family members, regardless of their tech experience. While icons are helpful, they can sometimes be ambiguous, especially for users who aren’t familiar with app conventions. By combining icons with clear labels, such as “Log Out,” “New Task,” or “Send,” we ensure that users can quickly understand the function of each button.
- **Simple, Descriptive Language**: Using familiar, conversational language throughout the app makes it approachable. For example, instead of using complex or technical terms, we use simple phrases like “Hello!” and “You have x tasks left!” This casual tone creates a friendly atmosphere and makes it easy for users of any age to engage with the app.
- **Guided Prompts and Placeholders:** Including prompts and clear instructions, such as “Search a task…” in the search bar or “Please sign in to continue” on the login screen, helps guide users on what to do next, making the app feel intuitive even for new users.
- **Color Coding for Status Indication**: Tasks are color-coded based on their status (e.g., green for Active, yellow for Snoozed, and gray for Completed), making it easy to identify at a glance what tasks are ongoing, paused, or finished. This color-coding strategy reduces the cognitive load on users by allowing them to quickly interpret information visually without having to read through details.

---

## Assumptions Made

- Users are authenticated using a basic email and name system. More complex authentication (e.g., OAuth) is not implemented.
- All users have access to view and participate in any task without role-based restrictions.

## Known Limitations

- **File Uploads**: While the UI allows users to select files, backend support for file uploads (e.g., saving to Supabase storage) is not implemented.
- **Role-Based Permissions**: The app does not include roles or permissions for users beyond task assignments.

## Future Improvements

- **Improved Real-Time Chat**: Implement Supabase’s real-time capabilities for smoother, instant chat updates.
- **File Storage**: Integrate Supabase storage or similar to allow actual file uploads for task attachments.
- **Push Notifications**: Notify users when they’re assigned a task or receive a message.
- **Role-Based Access Control**: Introduce permissions for different user roles to manage who can view, edit, or delete tasks.
- **Enhanced Authentication**: Add secure authentication with providers like Google and Facebook.

---
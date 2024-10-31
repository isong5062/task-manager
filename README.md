This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Shared Task Manager

A collaborative task management web application designed for families to track and discuss shared tasks with integrated chat functionality. Users can create, assign, and communicate about tasks in real-time.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Technology Choices and Rationale](#technology-choices-and-rationale)
- [Assumptions Made](#assumptions-made)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

### 2. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) installed, then run:

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory to configure your Supabase environment variables. Add the following:

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

### 5. Run the Application

After setting up the database and environment variables, start the application:

```bash
npm run dev
```

The application should now be available at `http://localhost:3000`.

---

## Technology Choices and Rationale

- **Next.js**: Chosen for its optimized server-side rendering, efficient development workflow, and easy API integration.
- **Supabase**: Selected as a scalable, easy-to-use backend that offers a PostgreSQL database with RESTful API and real-time subscriptions.
- **Tailwind CSS**: Employed for rapid and responsive UI development with minimal custom CSS, ensuring a clean and scalable styling process.

## Assumptions Made

- Users are authenticated using a basic email and name system. More complex authentication (e.g., OAuth) is not implemented.
- All users have access to view and participate in any task without role-based restrictions.

## Known Limitations

- **File Uploads**: While the UI allows users to select files, backend support for file uploads (e.g., saving to Supabase storage) is not implemented.
- **Real-time Updates**: Currently, chat functionality uses polling for real-time updates instead of Supabase's real-time capabilities, which could be implemented for a smoother experience.
- **Role-Based Permissions**: The app does not include roles or permissions for users beyond task assignments.

## Future Improvements

- **Enhanced Authentication**: Add secure authentication with providers like Google and Facebook.
- **Improved Real-Time Chat**: Implement Supabase’s real-time capabilities for smoother, instant chat updates.
- **File Storage**: Integrate Supabase storage or similar to allow actual file uploads for task attachments.
- **Push Notifications**: Notify users when they’re assigned a task or receive a message.
- **Role-Based Access Control**: Introduce permissions for different user roles to manage who can view, edit, or delete tasks.

---
```
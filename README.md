# StitchGrab Source Code

## Overview
This repository contains the source code for StitchGrab, built with Medusa (headless commerce engine) and Next.js. Follow the instructions below to set up, develop, and push changes to GitHub. **Do not push directly to production.** All changes should be made and reviewed through GitHub first.

---

## Table of Contents
1. [Cloning the Repository](#cloning-the-repository)
2. [Setting Up the Development Environment](#setting-up-the-development-environment)
3. [Developing Locally](#developing-locally)
4. [Pushing Changes to GitHub](#pushing-changes-to-github)
5. [Important Notes](#important-notes)
6. [Additional Resources](#additional-resources)

---

## Cloning the Repository
To get started with the project, clone the GitHub repository to your local machine.

1. Open your terminal.
2. Run the following command:

   ```bash
   git clone https://github.com/your-username/stg-medusa.git
   ```

3. Navigate to the project directory:

   ```bash
   cd stg-medusa
   ```

---

## Setting Up the Development Environment

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- Redis
- npm or yarn

### Installing Node.js

#### macOS
1. **Using Homebrew (Recommended)**:
   ```bash
   # Install Homebrew if you don't have it
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install Node.js
   brew install node
   ```

2. **Using the Official Installer**:
   - Visit [nodejs.org](https://nodejs.org/en/download/)
   - Download the macOS installer (.pkg file)
   - Run the installer and follow the setup wizard

#### Windows
1. **Using the Official Installer**:
   - Visit [nodejs.org](https://nodejs.org/en/download/)
   - Download the Windows installer (.msi file)
   - Run the installer and follow the setup wizard

2. **Using Chocolatey**:
   ```bash
   choco install nodejs
   ```

3. **Using Winget**:
   ```bash
   winget install OpenJS.NodeJS
   ```

#### Linux (Ubuntu/Debian)
1. **Using NodeSource Repository**:
   ```bash
   # Add NodeSource repository
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   
   # Install Node.js
   sudo apt-get install -y nodejs
   ```

2. **Using Snap**:
   ```bash
   sudo snap install node --classic
   ```

#### Linux (CentOS/RHEL/Fedora)
1. **Using NodeSource Repository**:
   ```bash
   # Add NodeSource repository
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   
   # Install Node.js
   sudo yum install -y nodejs
   ```

#### Verify Installation
After installation, verify that Node.js and npm are installed correctly:
```bash
node --version
npm --version
```

You should see output similar to:
```
v18.17.0
9.6.7
```
**Note**: This project requires Node.js version 18 or higher. If you have an older version, please upgrade to a supported version.

### Installing postgres

You can install PostgreSQL using either Postgres.app (recommended for most Mac users) or Homebrew. Both methods work well for development.

#### **Option 1: Using Postgres.app (Recommended for macOS)**
1. Download Postgres.app from [https://postgresapp.com/](https://postgresapp.com/)
2. Open the downloaded `.dmg` file and drag **Postgres.app** to your `/Applications` folder.
3. Launch Postgres.app from `/Applications`.
4. (Optional) Add Postgres binaries to your PATH:
   - Open Postgres.app, click the elephant icon in the menu bar, and select "Open psql". This will guide you to add the binaries to your PATH for terminal access.
5. To verify installation, run in your terminal:
   ```bash
   psql --version
   ```
6. The server should start automatically when you open Postgres.app. You can see the status in the app or the menu bar.

#### **Option 2: Using Homebrew**
1. Install PostgreSQL via Homebrew:
   ```bash
   brew install postgresql
   ```
2. Start the PostgreSQL service:
   ```bash
   brew services start postgresql
   ```
3. To verify installation, run:
   ```bash
   psql --version
   ```
4. To check if the server is running:
   ```bash
   psql -U postgres -c '\l'
   ```
   If you see a list of databases, the server is running.

#### **Optional: Install pgAdmin4 (GUI for PostgreSQL)**
- **With Homebrew:**
  ```bash
  brew install --cask pgadmin4
  ```
- **Or download from:** [https://www.pgadmin.org/download/pgadmin-4-macos/](https://www.pgadmin.org/download/pgadmin-4-macos/)

pgAdmin4 allows you to manage your PostgreSQL databases with a graphical interface.

### Backend Setup (Medusa Server)
1. **Navigate to the backend directory**:
   ```bash
   cd stg
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy the example environment file:
     ```bash
     cp .env.template .env
     ```
   - Configure your database and Redis connections in the `.env` file

4. **Run database migrations**:
   * For new set up
   ```bash
   npx medusa db:setup --db medusa-stg
   ```
   * To run migrations 
   ```bash
   npx medusa db:migrate:scripts
   ```
   * or 
   ```bash
   npx medusa db:migrate
   ```

5. **Seed the database (optional)**:
   ```bash
   npx medusa seed
   ```

6. ***Create admin user***

   - **Method 1: Using the Medusa CLI (Recommended)**

   1. **Navigate to your backend directory:**
      ```bash
      cd stg
      ```

   2. **Create an admin user:**
      ```bash
      npx medusa user --email admin@example.com --password your_password
      ```

   3. **Make the user an admin:**
      ```bash
      npx medusa user --email admin@example.com --role admin
      ```

   - **Method 2: Using the Admin API**

   1. **Start your Medusa server** (if not already running):
      ```bash
      npm run dev
      ```

   2. **Create a user via API:**
      ```bash
      curl -X POST http://localhost:9000/admin/users \
        -H "Content-Type: application/json" \
        -d '{
          "email": "admin@example.com",
          "password": "your_password",
          "role": "admin"
        }'
      ```

   - **Method 3: Using the Admin Dashboard**

   1. **Start your Medusa server** and navigate to `http://localhost:9000/app`
   2. **Register a new user** through the admin interface
   3. **Use the CLI to make them an admin:**
      ```bash
      npx medusa user --email admin@example.com --role admin
      ```

   **After creating the admin user, you can log in to the admin dashboard at `http://localhost:9000/app` using the email and password you set.**

7. ***Create Obtain a Medusa Publishable API Key**
   - Run stg dev 
     - ```bash
      cd stg
      npm run dev
      ```
   - Login with created credentials
   - Navigate to `Developer` menu and create Publishable API Keys and Scert API Keys
   - Optionaally you can create a publishable API key either using the Medusa Admin or the Admin API routes
      ```bash
      curl -X POST 'http://localhost:9000/admin/api-keys' 
         -H 'Authorization: Bearer {token}' 
         -H 'Content-Type: application/json' 
         --data-raw '{ 
            "title": "Storefront Key", 
            "type": "publishable" 
         }'
      ``` 
8. ***Create regions in admin console***

### Frontend Setup (Storefront)
1. **Navigate to the storefront directory**:
   ```bash
   cd stg-storefront
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy the example environment file:
     ```bash
     cp ./stg/.env .env
     ```
   - Configure your Medusa backend URL in the `.env` file
  

## Developing Locally

### Starting the Backend
1. **Start the Medusa server**:
   ```bash
   cd stg
   npm run dev
   ```
   - The Medusa backend will be accessible at `http://localhost:9000` by default.

2. **Access the Medusa admin panel**:
   - Navigate to `http://localhost:9000/app` to access the admin interface.



### Starting the Frontend
1. **Start the storefront**:
   ```bash
   cd stg-storefront
   npm run dev
   ```
   - The storefront will be accessible at `http://localhost:3000` by default.

### Working with the Application
- Make changes to the backend files in the `stg/` directory.
- Make changes to the frontend files in the `stg-storefront/` directory.
- Test your changes locally by refreshing the browser.
- Use the Medusa admin panel to manage products, orders, and customers.

---

## Pushing Changes to GitHub

1. **Stage your changes**:
   ```bash
   git add .
   ```

2. **Commit your changes**:
   ```bash
   git commit -m "Description of your changes"
   ```

3. **Push Changes to GitHub**:
   - After committing your changes, push the branch to the GitHub repository with:

      ```bash
      git push origin feature/branch-name
      ```

   - If your IDE has GitHub integration (e.g., VS Code), you can push changes directly from the IDE's built-in Git panel.

4. **Create a Pull Request (PR)**:
   - Pull requests are required for features or fixes that are intended to go to the `staging` or `main` branches.
   - Open a Pull Request on GitHub:
        - Go to the repository: https://github.com/lloydelpessoa/stg-medusa
        - Select your branch and target either `staging` or `main`.
   - Add appropriate reviewers.
   - Wait for a code review and approval before merging.

---

## Important Notes

- **Do NOT Push Directly to Production**:
  Changes should always go through GitHub. Production deployments should be set up to deploy directly from GitHub branches (`main` for production, `staging` for staging).

  Direct pushes to production bypass version control and code review, which can lead to errors and inconsistencies.

- **Branch Naming**:
  Follow consistent branch naming conventions:
    - `feature/description` for new features.
    - `bugfix/description` for bug fixes.
    - `hotfix/description` for urgent fixes.

- **Testing**:
  Always test your code locally before creating a PR.

- **Environment Variables**:
  Never commit sensitive environment variables to the repository. Always use `.env` files for local development and secure environment variable management for production.

- **Database Migrations**:
  When making changes to the database schema, always create and test migrations locally before pushing to GitHub.

- **Be on the lookout!**
  This README will be consistently updated with new instructions/deployment requirements as this application gets built out.

---

## Additional Resources
- [Medusa Documentation](https://docs.medusajs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Git Basics](https://git-scm.com/doc)
- [Node.js Installation](https://nodejs.org/en/download/) 
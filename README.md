# StitchGrab Source Code

## Overview
This repository contains the source code for StitchGrab, built with Medusa (headless commerce engine) and Next.js. Follow the instructions below to set up, develop, and push changes to GitHub. **Do not push directly to production.** All changes should be made and reviewed through GitHub first.

---

## Table of Contents
1. [Cloning the Repository](#cloning-the-repository)
2. [Setting Up the Development Environment](#setting-up-the-development-environment)
3. [Developing Locally](#developing-locally)
4. [Database Cleanup and Seeding](#database-cleanup-and-seeding)
5. [Pushing Changes to GitHub](#pushing-changes-to-github)
6. [Important Notes](#important-notes)
7. [Additional Resources](#additional-resources)

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
     cp .env.example .env
     ```
   - Configure your database and Redis connections in the `.env` file

4. **Run database migrations**:
   ```bash
   npx medusa migrations run
   ```

5. **Seed the database (optional)**:
   ```bash
   npx medusa seed
   ```

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
     cp .env.example .env
     ```
   - Configure your Medusa backend URL in the `.env` file

---

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

## Database Cleanup and Seeding

### Cleaning Up the Database
When you need to start fresh or reset your development database, you can clean up existing data:

1. **Navigate to the backend directory**:
   ```bash
   cd stg
   ```

2. **Reset the database (this is only if you are having issues with your db)** (⚠️ **Warning**: This will delete all data):
   ```bash
   npx medusa db reset
   ```
   This command will:
   - Drop all tables
   - Run all migrations
   - Create fresh database structure

3. **Alternative: Drop and recreate database**:
   ```bash
   # Drop the database (replace 'your_db_name' with your actual database name)
   dropdb your_db_name
   
   # Create a new database
   createdb your_db_name
   
   # Run migrations
   npx medusa migrations run
   ```

### Seeding Dummy Products
After cleaning up the database, you can seed it with dummy products for development:

1. **Use Medusa's built-in seed command**:
   ```bash
   npx medusa seed
   ```
   This will create:
   - Sample products with variants
   - Product categories
   - Collections
   - Sample customers
   - Sample orders

2. **Custom seeding** (if you have custom seed files):
   ```bash
   # Run Stitchgrab dummy products seed files
   npm run seed:dummy
   
   # Clean up custom seeding
   npm run cleanup:dummy
   ```

3. **Manual product creation via Admin Panel**:
   - Start the Medusa server: `npm run dev`
   - Access the admin panel at `http://localhost:9000/app`
   - Navigate to Products → Create Product
   - Add products manually with:
     - Product title and description
     - Product images
     - Variants (sizes, colors, etc.)
     - Pricing
     - Inventory

### Best Practices for Development Data
- **Use realistic data**: Create products that match your actual business needs
- **Include various product types**: Different categories, price ranges, and variants
- **Test edge cases**: Products with no inventory, out-of-stock items, etc.
- **Regular cleanup**: Reset your database periodically to avoid data conflicts
- **Backup important data**: Export any custom data before cleanup

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
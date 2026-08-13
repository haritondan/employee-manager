# Team Directory — Full-Stack Management App

A responsive, full-stack team directory web application built with Vanilla JS, Express, and PostgreSQL. Features server-side pagination, sorting, live filtering via URL query parameters, full CRUD operations, and accessible HTML5 client interface.

---

## How to Run the Project

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running (includes `docker` and `docker compose`).

---

### Step-by-Step Execution

This project uses Docker Compose to run both the PostgreSQL database and the Node.js API server in isolated containers with automatic health checks and database auto-seeding.

#### Step 1: Navigate to the Project Root

Open your terminal and change into the project directory:

```bash
cd /path/to/project-root
```

#### Step 2: Build and Launch Containers

Run the following command to build the Node.js application container image and launch both services:

```bash
docker compose up --build
```

#### Step 3: Wait for Health Check and Auto-Seeding

1. Docker starts the `db` container (`postgres:15-alpine`) first.
2. The `server` container monitors PostgreSQL and waits until it passes its health check (`pg_isready`).
3. On the initial boot, the server automatically executes the SQL migration to create the `records` table and seeds it with 200 fake team member records using `@faker-js/faker`.

#### Step 4: Access the Application

Once the terminal displays `Server running on http://localhost:3000`, open your web browser and go to:

```bash
http://localhost:3000
```

#### Step 5: Stop or Reset the Application

- To stop the running application: Press Ctrl + C in the terminal, or run:

```bash
docker compose down
```

To stop and wipe the PostgreSQL database volume (resets seeded data for a fresh start):

```bash
docker compose down -v
```

## Project Overview & Tech Stack

### Tech Stack

- Frontend: Vanilla JavaScript (ES Modules), HTML5 Native , CSS Variables, CSS @starting-style backdrop animations.
- Backend: Node.js, Express.js (express-validator for payload sanitization and validation).
- Database: PostgreSQL (pg connection pool, parameterized raw SQL queries).
- DevOps: Docker, Docker Compose.

---

### Key Features

- URL-Driven State: Syncs search, sorting, modal states, limit, and pagination directly with browser URL params (popstate navigation supported).
- Backend-Driven Operations: Searching, column sorting, offset pagination, and filtering are executed directly at the database level via SQL query params.
- Native Modals: Uses accessible `<dialog>` elements for Add, Edit, and Delete confirmations with native `showModal()` and backdrop transitions.
- Responsive Card Layout: Automatically transforms the data table into styled mobile card components on screens under 768px via `data-label` attributes.
- Input Sanitization & Validation: Both client-side (Constraint Validation API) and backend route-level validation (`express-validator`) + HTML escaping to prevent XSS.

---

### Endpoints Table

| Endpoint           | Method   | Query / Body Params                          | Description                           |
| :----------------- | :------- | :------------------------------------------- | :------------------------------------ |
| `/api/records`     | `GET`    | `search`, `sortBy`, `order`, `page`, `limit` | Fetch paginated & sorted team records |
| `/api/records/:id` | `GET`    | —                                            | Fetch single member by ID             |
| `/api/records`     | `POST`   | `{ name, email, department, role, status }`  | Create a new team member              |
| `/api/records/:id` | `PUT`    | `{ name, email, department, role, status }`  | Update an existing member             |
| `/api/records/:id` | `DELETE` | —                                            | Remove a team member                  |

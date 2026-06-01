# MyCustomers API

A lightweight REST API built with **Node.js**, **Express**, and **MongoDB** for managing customer records.

## Features

- Upsert logic on `GET /` — inserts a customer only if they don't already exist
- Create new customer records via `POST /customers`
- Retrieve all customers via `GET /customers`
- Health check endpoint
- Graceful shutdown on `SIGINT`

## Tech Stack

| Layer    | Technology        |
|----------|-------------------|
| Runtime  | Node.js           |
| Framework| Express 4         |
| Database | MongoDB 3         |
| Extras   | CORS, body-parser |

## Prerequisites

- Node.js v14+
- MongoDB running locally or accessible via URI

## Getting Started

```bash
# Clone the repository
git clone https://github.com/dhirajkumar/mycustomersindex.git
cd mycustomersindex

# Install dependencies
npm install

# Start the server (default port: 9090)
node index.js
```

## Configuration

The following environment variables can be set to override defaults:

| Variable    | Default                      | Description              |
|-------------|------------------------------|--------------------------|
| `MONGO_URL` | `mongodb://localhost:27017`  | MongoDB connection URI   |
| `DB_NAME`   | `project`                    | Database name            |
| `PORT`      | `9090`                       | Port the server listens on |

Example:

```bash
MONGO_URL=mongodb://user:pass@host:27017 DB_NAME=mydb PORT=3000 node index.js
```

## API Reference

### `GET /health`

Returns server and database status.

**Response**
```json
{ "ok": true, "dbConnected": true }
```

---

### `GET /`

Looks for an existing customer. Inserts one if not found.

**Response — found**
```json
{ "action": "found", "data": { "_id": "...", "first_name": "Dhiraj", "last_name": "Kumar" } }
```

**Response — inserted**
```json
{ "action": "inserted", "data": { "_id": "...", "first_name": "Dhiraj", "last_name": "Kumar" } }
```

---

### `GET /customers`

Returns all customer documents.

**Response**
```json
[
  { "_id": "...", "first_name": "Jane", "last_name": "Doe" }
]
```

---

### `POST /customers`

Inserts a new customer document.

**Request body**
```json
{ "first_name": "Jane", "last_name": "Doe" }
```

**Response `201`**
```json
{ "insertedId": "...", "data": { "first_name": "Jane", "last_name": "Doe" } }
```

## License

ISC

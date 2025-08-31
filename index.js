// server.js
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Config (override via env if you like)
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'project';
const PORT = process.env.PORT || 9090;

let client;
let db;

/**
 * Connect to MongoDB and start the server
 */
async function start() {
  try {
    client = new MongoClient(MONGO_URL);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Successfully connected to MongoDB!!');

    app.listen(PORT, () => {
      console.log(`server running at http://localhost:${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        console.log('\nShutting down...');
        await client.close();
        process.exit(0);
      } catch (e) {
        console.error('Error during shutdown:', e);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('Error while connecting to mongo. Make sure mongodb is running');
    console.error(err);
    process.exit(1);
  }
}

/**
 * Health route (optional)
 */
app.get('/health', (req, res) => {
  res.json({ ok: true, dbConnected: !!db });
});

/**
 * GET /
 * - Looks for a customer with first_name: "Dhiraj"
 * - If not found, inserts { first_name: "Dhiraj", last_name: "Kumar" }
 * - Returns the found/inserted document and an action indicator
 */
app.get('/', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not connected' });

    const customers = db.collection('customers');

    // Try to find one document
    const existing = await customers.findOne({ first_name: 'Dhiraj' });

    if (existing) {
      console.log('Document found');
      return res.json({ action: 'found', data: existing });
    }

    // Not found — insert new
    const doc = { first_name: 'Dhiraj', last_name: 'Kumar' };
    const insertRes = await customers.insertOne(doc);

    const inserted = { _id: insertRes.insertedId, ...doc };
    console.log('1 document inserted');

    return res.json({ action: 'inserted', data: inserted });
  } catch (err) {
    console.error('Error in GET /:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * POST /customers
 * - Inserts the JSON body as a new customer document
 * - Example body: { "first_name": "Jane", "last_name": "Doe" }
 */
app.post('/customers', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not connected' });

    const body = req.body || {};
    if (!Object.keys(body).length) {
      return res.status(400).json({ error: 'Request body is empty' });
    }

    const result = await db.collection('customers').insertOne(body);
    return res.status(201).json({ insertedId: result.insertedId, data: body });
  } catch (err) {
    console.error('Error in POST /customers:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /customers
 * - Returns all customers (basic helper route)
 */
app.get('/customers', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not connected' });

    const all = await db.collection('customers').find({}).toArray();
    return res.json(all);
  } catch (err) {
    console.error('Error in GET /customers:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the app
start();

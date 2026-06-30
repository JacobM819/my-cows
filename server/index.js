// server/index.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";

dotenv.config();

// load express
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// load sqlite
const sqlite = sqlite3.verbose();
const dbPath = process.env.DB_PATH || "./data/scores.sqlite";

const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error("Could not connect to database", err);
  } else {
    console.log("Connected to the SQLite database.");

    // Create the table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS players (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT,
         score INTEGER
      )
    `,
      (err) => {
        if (err) {
          console.error("Error creating table:", err);
        } else {
          console.log("Players table is ready.");
          db.run(
            `
          INSERT INTO players (name, score)
          VALUES
           ("Jake", 0),
           ("Trysta", 0)
        `,
            (insertErr) => {
              if (!insertErr) console.log("Default players added.");
            },
          );
        }
      },
    );
  }
});

const REDIS_URL = process.env.REDIS_REST_URL;
const REDIS_TOKEN = process.env.REDIS_TOKEN;

app.post("/score", express.json(), async (req, res) => {
  const { player, score, action } = req.body;
  console.log(player, score, action);

  if (
    typeof player !== "number" ||
    typeof score !== "number" ||
    typeof action !== "string"
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const sql = `
               UPDATE players
               SET score = ?
               WHERE id = ?
               `;

  const params = [score, player];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
  });

  res.json({ status: "success", setResult: data });
});

app.get("/score/:player", async (req, res) => {
  const { player } = req.params;

  const response = await fetch(`${REDIS_URL}/get/score:${player}`, {
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
    },
  });

  const data = await response.json();

  if (!data.result) {
    return res.status(404).json({ error: "Score not found" });
  }

  res.json({ score: parseInt(data.result, 10) });
});

app.post("/log-event", express.json(), async (req, res) => {
  const { player, score, action } = req.body;

  if (
    typeof player !== "number" ||
    typeof score !== "number" ||
    typeof action !== "string"
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const event = {
    player,
    score,
    action,
    timestamp: new Date().toISOString(),
  };

  const response = await fetch(`${REDIS_URL}/lpush/event_log`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event), // double-stringify for Redis REST
  });

  const data = await response.json();
  res.json({ status: data.result });
});

app.get("/latest-event", async (req, res) => {
  const response = await fetch(`${REDIS_URL}/lrange/event_log/0/0`, {
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
    },
  });

  const data = await response.json();

  if (!data.result || data.result.length === 0) {
    return res.status(404).json({ error: "No events found" });
  }

  const latestEvent = JSON.parse(data.result[0]);
  res.json({ event: latestEvent });
});

app.get("/health", async (req, res) => {
  try {
    const response = await fetch(`${REDIS_URL}/ping`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
      },
    });
    const data = await response.json();
    if (data.result === "PONG") {
      res.status(200).json({ status: "ready" });
    } else {
      res.status(500).json({ status: "waiting" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

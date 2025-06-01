// server/index.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

const REDIS_REST_URL = process.env.REDIS_REST_URL;
const REDIS_TOKEN = process.env.REDIS_TOKEN;

app.get("/score/:player", async (req, res) => {
    const { player } = req.params;
    const response = await fetch(`${process.env.REDIS_REST_URL}/get/score:${player}`, {
        headers: {
            Authorization: `Bearer ${process.env.REDIS_TOKEN}`,
        },
    });

    const data = await response.json();
    res.json({ score: Number(data.result) || 0 });
});

app.post("/log-event", express.json(), async (req, res) => {
    const { player, score, action} = req.body;

    if (typeof player !== "number" || typeof score !== "number" || typeof action !== "string") {
        return res.status(400).json({ error: "Invalid input" });
    }

    const event = {
        player,
        score,
        action,
        timestamp: new Date().toISOString(),
    };

    const response = await fetch(`${process.env.REDIS_REST_URL}/lpush/event_log`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.REDIS_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: (JSON.stringify(event)) // double-stringify for Redis REST
    });

    const data = await response.json();
    res.json({ status: data.result });
});

app.get("/latest-event", async (req, res) => {
    const response = await fetch(`${process.env.REDIS_REST_URL}/lrange/event_log/0/0`, {
        headers: {
            Authorization: `Bearer ${process.env.REDIS_TOKEN}`,
        },
    });

    const data = await response.json();

    if (!data.result || data.result.length === 0) {
        return res.status(404).json({ error: "No events found" });
    }

    const latestEvent = JSON.parse(data.result[0]);
    res.json({ event: latestEvent });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

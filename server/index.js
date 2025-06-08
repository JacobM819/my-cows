// server/index.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

const REDIS_URL = process.env.REDIS_REST_URL;
const REDIS_TOKEN = process.env.REDIS_TOKEN;

app.post("/score", express.json(), async (req, res) => {
    const { player, score, action } = req.body;
    console.log(player, score, action);

    if (typeof player !== "number" || typeof score !== "number" || typeof action !== 'string') {
        return res.status(400).json({ error: "Invalid input" });
    }

    const response = await fetch(`${REDIS_URL}/set/score:${player}/${score}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${REDIS_TOKEN}`,
        },
    });

    const data = await response.json();
    console.log("SET result:", data);

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

    const response = await fetch(`${REDIS_URL}/lpush/event_log`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${REDIS_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: (JSON.stringify(event)) // double-stringify for Redis REST
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

app.get("/health", async(req, res) => {
    try {
        const response = await fetch(`${REDIS_URL}/ping`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${REDIS_TOKEN}`,
            }
        });
        const data = await response.json();
        if (data.result === "PONG") {
            res.status(200).json({status: "ready"});
        } else {
            res.status(500).json({status: "waiting"});
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

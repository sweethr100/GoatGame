const crypto = require("node:crypto");

const ALLOWED_MODES = new Set(["precision", "reflex", "tracking"]);
const MAX_LEADERBOARD_ROWS = 10;
const MAX_PLAYER_SCORES_PER_MODE = 5;
const MAX_SUBMISSIONS_PER_WINDOW = 6;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const PRACTICE_SETTINGS_DEFAULTS = {
    precision: { radius: 0.09, targetCount: 3, duration: 40 },
    reflex: { duration: 40 },
    tracking: { speed: 1.8, radius: 0.09, duration: 40, movement: "random" }
};

function json(statusCode, body) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store"
        },
        body: JSON.stringify(body)
    };
}

function getSupabaseConfig() {
    const url = String(process.env.SUPABASE_URL || "").replace(/\/+$/, "");
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
        throw new Error("Supabase leaderboard environment variables are not configured.");
    }

    return { url, serviceRoleKey };
}

async function supabaseRequest(path, options = {}) {
    const { url, serviceRoleKey } = getSupabaseConfig();
    const response = await fetch(`${url}/rest/v1/${path}`, {
        ...options,
        headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Supabase leaderboard request failed:", response.status, errorBody);
        throw new Error("Supabase leaderboard request failed.");
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

function readInteger(value, min, max) {
    return Number.isInteger(value) && value >= min && value <= max ? value : null;
}

function normalizePlayerName(value) {
    const playerName = String(value || "").trim().replace(/\s+/g, " ");
    const length = Array.from(playerName).length;

    if (length < 2 || length > 16 || /[\u0000-\u001f\u007f]/.test(playerName)) {
        return null;
    }

    return playerName;
}

function isDefaultModeOptions(mode, options) {
    const defaults = PRACTICE_SETTINGS_DEFAULTS[mode];
    if (!defaults || !options || typeof options !== "object" || Array.isArray(options)) {
        return false;
    }

    return Object.entries(defaults).every(([key, defaultValue]) => {
        const value = options[key];
        return typeof defaultValue === "string"
            ? String(value).toLowerCase() === defaultValue.toLowerCase()
            : value === defaultValue;
    });
}

function validateScore(payload) {
    const playerName = normalizePlayerName(payload.playerName);
    const mode = ALLOWED_MODES.has(payload.mode) ? payload.mode : null;
    const score = readInteger(payload.score, 0, 1000000);
    const accuracy = readInteger(payload.accuracy, 0, 100);
    const hits = readInteger(payload.hits, 0, 100000);
    const shots = readInteger(payload.shots, 0, 100000);
    const bestStreak = readInteger(payload.bestStreak, 0, 100000);
    const durationSeconds = readInteger(payload.durationSeconds, 15, 180);
    const trackingSeconds = Number(payload.trackingSeconds);

    if (
        !playerName
        || !mode
        || score === null
        || accuracy === null
        || hits === null
        || shots === null
        || bestStreak === null
        || durationSeconds === null
        || durationSeconds !== PRACTICE_SETTINGS_DEFAULTS[mode]?.duration
        || !isDefaultModeOptions(mode, payload.options)
        || !Number.isFinite(trackingSeconds)
        || trackingSeconds < 0
        || trackingSeconds > durationSeconds + 0.2
    ) {
        return null;
    }

    if (mode === "tracking") {
        const expectedAccuracy = Math.round((trackingSeconds / durationSeconds) * 100);
        if (hits !== 0 || shots !== 0 || bestStreak !== 0 || score > durationSeconds * 100 + 1 || Math.abs(accuracy - expectedAccuracy) > 2) {
            return null;
        }
    } else {
        const expectedAccuracy = shots === 0 ? 100 : Math.round((hits / shots) * 100);
        if (
            trackingSeconds !== 0
            || hits > shots
            || bestStreak > hits
            || shots > durationSeconds * 40
            || score > hits * 2300
            || accuracy !== expectedAccuracy
        ) {
            return null;
        }
    }

    return {
        player_name: playerName,
        mode,
        score,
        accuracy,
        duration_seconds: durationSeconds,
        hits,
        shots,
        best_streak: bestStreak,
        tracking_seconds: Number(trackingSeconds.toFixed(1))
    };
}

function getClientHash(event) {
    const headers = event.headers || {};
    const forwardedFor = headers["x-forwarded-for"] || headers["client-ip"] || "unknown";
    const ipAddress = String(forwardedFor).split(",")[0].trim();
    const userAgent = headers["user-agent"] || "unknown";
    const secret = process.env.LEADERBOARD_HASH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "local-development";
    return crypto.createHmac("sha256", secret).update(`${ipAddress}|${userAgent}`).digest("hex");
}

async function listScores(mode) {
    const query = new URLSearchParams({
        select: "id,player_name,mode,score,accuracy,created_at",
        mode: `eq.${mode}`,
        order: "score.desc,created_at.asc",
        limit: String(MAX_LEADERBOARD_ROWS)
    });

    return supabaseRequest(`leaderboard_scores?${query}`);
}

async function enforceRateLimit(clientHash) {
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const query = new URLSearchParams({
        select: "id",
        client_hash: `eq.${clientHash}`,
        created_at: `gte.${since}`,
        limit: String(MAX_SUBMISSIONS_PER_WINDOW)
    });
    const recentScores = await supabaseRequest(`leaderboard_scores?${query}`);

    if (recentScores.length >= MAX_SUBMISSIONS_PER_WINDOW) {
        const error = new Error("Too many leaderboard submissions.");
        error.statusCode = 429;
        throw error;
    }
}

async function prunePlayerScores(playerName, mode) {
    const query = new URLSearchParams({
        select: "id",
        player_name: `eq.${playerName}`,
        mode: `eq.${mode}`,
        order: "score.desc,created_at.asc",
        offset: String(MAX_PLAYER_SCORES_PER_MODE)
    });
    const extraScores = await supabaseRequest(`leaderboard_scores?${query}`);

    if (extraScores.length === 0) {
        return;
    }

    const ids = extraScores.map(({ id }) => id).join(",");
    await supabaseRequest(`leaderboard_scores?id=in.(${ids})`, {
        method: "DELETE",
        headers: { Prefer: "return=minimal" }
    });
}

async function submitScore(event) {
    let payload;
    try {
        payload = JSON.parse(event.body || "{}");
    } catch {
        return json(400, { error: "invalid_json" });
    }

    const score = validateScore(payload);
    if (!score) {
        return json(400, { error: "invalid_score" });
    }

    const clientHash = getClientHash(event);
    await enforceRateLimit(clientHash);
    await supabaseRequest("leaderboard_scores", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ ...score, client_hash: clientHash })
    });

    try {
        await prunePlayerScores(score.player_name, score.mode);
        return json(201, { scores: await listScores(score.mode) });
    } catch (error) {
        console.error("Leaderboard refresh failed after submission:", error);
        return json(201, { scores: null, refresh_failed: true });
    }
}

exports.handler = async function(event) {
    try {
        if (event.httpMethod === "GET") {
            const mode = ALLOWED_MODES.has(event.queryStringParameters?.mode)
                ? event.queryStringParameters.mode
                : "precision";
            return json(200, { scores: await listScores(mode) });
        }

        if (event.httpMethod === "POST") {
            return await submitScore(event);
        }

        return json(405, { error: "method_not_allowed" });
    } catch (error) {
        console.error("Leaderboard function error:", error);
        return json(error.statusCode || 500, {
            error: error.statusCode === 429 ? "rate_limited" : "server_error"
        });
    }
};

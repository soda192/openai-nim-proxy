const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "20mb" }));

const NIM_API_KEY = process.env.NIM_API_KEY;
const NIM_BASE = "https://integrate.api.nvidia.com/v1";

if (!NIM_API_KEY) {
  console.error("Missing NIM_API_KEY environment variable");
  process.exit(1);
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/v1/models", (req, res) => {
  res.json({
    object: "list",
    data: [
      { id: "llama-3.1-8b", object: "model" },
      { id: "llama-3.1-70b", object: "model" },
      { id: "llama-3.1-405b", object: "model" }
    ]
  });
});

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const response = await axios.post(
      `${NIM_BASE}/chat/completions`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${NIM_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);

  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      error: {
        message: err.response?.data || err.message
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on ${PORT}`);
});

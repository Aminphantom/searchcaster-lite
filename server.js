const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "No query provided" });

  try {
    const response = await axios.post("https://html.duckduckgo.com/html/", new URLSearchParams({ q: query }).toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const $ = cheerio.load(response.data);
    const results = [];

    $(".result__body").each((i, el) => {
      const title = $(el).find(".result__title").text().trim();
      const link = $(el).find(".result__url").attr("href");
      const snippet = $(el).find(".result__snippet").text().trim();

      if (title && link) {
        results.push({ title, link, snippet });
      }
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
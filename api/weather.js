// filepath: api/weather.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { type = "weather", q, lat, lon } = req.query;
  const key = process.env.OPENWEATHER_API_KEY;
  let url;

  if (type === "geo") {
    url = new URL(`https://api.openweathermap.org/geo/1.0/direct`);
    url.searchParams.append("q", q);
    url.searchParams.append("limit", "5");
  } else {
    const path = type === "forecast" ? "forecast" : "weather";
    url = new URL(`https://api.openweathermap.org/data/2.5/${path}`);
    if (q)   url.searchParams.append("q", q);
    if (lat) url.searchParams.append("lat", lat);
    if (lon) url.searchParams.append("lon", lon);
  }

  url.searchParams.append("appid", key);
  url.searchParams.append("units", "metric");
  url.searchParams.append("lang", "en");

  try {
    const apiRes = await fetch(url);
    const body   = await apiRes.text();
    res
      .status(apiRes.status)
      .setHeader("Content-Type", "application/json")
      .send(body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
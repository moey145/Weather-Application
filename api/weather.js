
export default async function handler(req, res) {
  console.log("🔍 Incoming query:", req.query);
  try {
    const { type = "weather", q, lat, lon } = req.query;
    const key = process.env.OPENWEATHER_API_KEY;
    if (!key) throw new Error("Missing OPENWEATHER_API_KEY");

    let urlStr;
    if (type === "geo") {
      urlStr = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${key}`;
    } else {
      const path = type === "forecast" ? "forecast" : "weather";
      const params = new URLSearchParams();
      if (q)   params.set("q", q);
      if (lat) params.set("lat", lat);
      if (lon) params.set("lon", lon);
      params.set("appid", key);
      params.set("units", "metric");
      params.set("lang", "en");
      urlStr = `https://api.openweathermap.org/data/2.5/${path}?${params}`;
    }

    console.log("→ Fetching:", urlStr);
    const apiRes = await fetch(urlStr);
    const body  = await apiRes.text();

    res
      .status(apiRes.status)
      .setHeader("Content-Type", "application/json")
      .send(body);
  } catch (err) {
    console.error("❌ Proxy error:", err);
    res.status(500).json({ error: err.message });
  }
}
export default async function handler(req, res) {
  try {
    const { type = "weather", q, lat, lon } = req.query;
    const key = process.env.OPENWEATHER_API_KEY;
    
    if (!key) {
      return res.status(500).json({ error: "Weather service configuration error" });
    }
    
    // Input validation
    if (type === "geo" && !q) {
      return res.status(400).json({ error: "Query parameter 'q' is required for geo requests" });
    }
    
    if (type !== "geo" && !q && (!lat || !lon)) {
      return res.status(400).json({ error: "Either 'q' or both 'lat' and 'lon' parameters are required" });
    }
    
    // Validate coordinates if provided
    if (lat && (isNaN(lat) || lat < -90 || lat > 90)) {
      return res.status(400).json({ error: "Invalid latitude value" });
    }
    
    if (lon && (isNaN(lon) || lon < -180 || lon > 180)) {
      return res.status(400).json({ error: "Invalid longitude value" });
    }

    let urlStr;
    if (type === "geo") {
      urlStr = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${key}`;
    } else {
      const path = type === "forecast" ? "forecast" : "weather";
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (lat) params.set("lat", lat);
      if (lon) params.set("lon", lon);
      params.set("appid", key);
      params.set("units", "metric");
      params.set("lang", "en");
      urlStr = `https://api.openweathermap.org/data/2.5/${path}?${params}`;
    }

    // Don't log the full URL in production (contains API key)
    console.log("→ Fetching weather data for:", type, q || `${lat},${lon}`);
    
    const apiRes = await fetch(urlStr);
    const body = await apiRes.text();

    res
      .status(apiRes.status)
      .setHeader("Content-Type", "application/json")
      .send(body);
  } catch (err) {
    console.error("❌ API handler error:", err.message);
    res.status(500).json({ error: "Weather service temporarily unavailable" });
  }
}
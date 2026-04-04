export default async function handler(req, res) {
  try {
    const path = req.query.path?.join("/") || "";

    // 🔥 include query params
    const query = req.url.split("?")[1];
    const url = `https://bhsquarebackend.onrender.com/${path}${
      query ? `?${query}` : ""
    }`;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers, // ✅ forward ALL headers
        host: undefined, // ❗ prevent host conflict
      },
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    const data = await response.text();

    // 🔥 Forward cookies properly
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    // 🔥 Forward status + response
    res.status(response.status).send(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy error" });
  }
}

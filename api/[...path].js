export default async function handler(req, res) {
  try {
    const path = req.query.path?.join("/") || "";

    const query = req.url.split("?")[1];
    const url = `https://bhsquarebackend.onrender.com/${path}${
      query ? `?${query}` : ""
    }`;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        "content-type": "application/json",
        cookie: req.headers.cookie || "", // 🔥 explicitly forward cookie
      },
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    // 🔥 VERY IMPORTANT: forward ALL cookies
    const setCookie = response.headers.raw()["set-cookie"];
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    // ✅ send JSON properly
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy error" });
  }
}

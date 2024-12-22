const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 8003;

// Middleware untuk CORS agar bisa diakses dari frontend
app.use(cors());

// Hitung jumlah koneksi aktif
let activeConnections = 0;

app.get("/events", (req, res) => {
  // Tambahkan koneksi baru
  activeConnections++;
  console.log(`New connection. Active connections: ${activeConnections}`);

  // Set header untuk SSE
  res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");

  // Kirim data ke client setiap 2 detik
  const interval = setInterval(() => {
    const data = {
      message: "Hello from server",
      time: new Date().toISOString(),
      activeConnections,
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 2000);

  // Handle jika koneksi ditutup
  req.on("close", () => {
    clearInterval(interval);
    activeConnections--;
    console.log(`Connection closed. Active connections: ${activeConnections}`);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`SSE server running on http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config({ path: "../../.env" });

const app = express();
app.use(cors({ origin: true }));

app.get("/config", (_req, res) => res.json({
  whatsappNumber: process.env.WHATSAPP_NUMBER || "573001234567"
}));

app.get("/health", async (_req, res) => {
  const servicios = {};
  for (const [nombre, url] of Object.entries({
    destinos: `http://localhost:${process.env.DESTINOS_PORT || 4001}/health`,
    paquetes: `http://localhost:${process.env.PAQUETES_PORT || 4002}/health`,
    chat: `http://localhost:${process.env.CHAT_PORT || 4003}/health`
  })) {
    try {
      const r = await fetch(url);
      servicios[nombre] = r.ok ? "ok" : "no disponible";
    } catch {
      servicios[nombre] = "no disponible";
    }
  }
  res.json({ servicio: "gateway", estado: "ok", servicios });
});

app.use("/api/destinos", createProxyMiddleware({
  target: `http://localhost:${process.env.DESTINOS_PORT || 4001}`,
  changeOrigin: true,
  on: {
    error: (_err, _req, res) => res.writeHead(502, { "Content-Type": "application/json" }).end(JSON.stringify({ error: "Servicio de destinos no disponible" }))
  }
}));

app.use("/api/paquetes", createProxyMiddleware({
  target: `http://localhost:${process.env.PAQUETES_PORT || 4002}`,
  changeOrigin: true,
  on: {
    error: (_err, _req, res) => res.writeHead(502, { "Content-Type": "application/json" }).end(JSON.stringify({ error: "Servicio de paquetes no disponible" }))
  }
}));

app.use("/api/chat", createProxyMiddleware({
  target: `http://localhost:${process.env.CHAT_PORT || 4003}`,
  changeOrigin: true,
  on: {
    error: (_err, _req, res) => res.writeHead(502, { "Content-Type": "application/json" }).end(JSON.stringify({ error: "Servicio de chat no disponible" }))
  }
}));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Error en gateway" });
});

const port = process.env.GATEWAY_PORT || 4000;
app.listen(port, () => console.log(`Gateway ViajaYa activo en ${port}`));

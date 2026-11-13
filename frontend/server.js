import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.FRONTEND_PORT || 5173;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Ruta explícita para la nueva página de catálogo
app.get("/catalogo", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "catalogo.html"));
});

// Ruta catch-all para la página de inicio
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Frontend ViajaYa (Node.js) activo en http://localhost:${port}`);
});

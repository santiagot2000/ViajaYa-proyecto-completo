import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { destinos } from "./data.js";

dotenv.config({ path: "../../.env" });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => res.json({
  servicio: "destinos-service",
  estado: "ok",
  totalDestinos: destinos.length
}));

// Listado de destinos (responde tanto en / como en /destinos)
app.get(["/", "/destinos"], (req, res) => {
  const { categoria, buscar, precioMax, orden } = req.query;
  let resultado = [...destinos];

  if (categoria && categoria !== "todos") {
    resultado = resultado.filter(d => d.categoria === categoria);
  }

  if (buscar) {
    const termino = String(buscar).toLocaleLowerCase("es");
    resultado = resultado.filter(d =>
      `${d.nombre} ${d.ciudad || ""} ${d.pais} ${d.descripcion} ${d.actividades?.join(" ")}`.toLocaleLowerCase("es").includes(termino)
    );
  }

  if (precioMax !== undefined && precioMax !== "") {
    resultado = resultado.filter(d => d.precio <= Number(precioMax));
  }

  // Ordenamiento
  if (orden === "precio_asc") {
    resultado.sort((a, b) => a.precio - b.precio);
  } else if (orden === "precio_desc") {
    resultado.sort((a, b) => b.precio - a.precio);
  } else if (orden === "rating") {
    resultado.sort((a, b) => b.rating - a.rating);
  } else if (orden === "nombre") {
    resultado.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }

  res.json({ datos: resultado, total: resultado.length });
});

// Detalle de un destino específico por ID
app.get(["/:id", "/destinos/:id"], (req, res) => {
  const id = req.params.id;
  const destino = destinos.find(d => d.id === id);
  if (!destino) return res.status(404).json({ error: "Destino no encontrado en el catálogo." });
  res.json(destino);
});

// Crear nuevo viaje / destino
app.post(["/", "/destinos"], (req, res) => {
  try {
    const { nombre, ciudad, pais = "Colombia", categoria = "ciudad", precio, duracion, descripcion, imagen, actividades, mejorEpoca } = req.body || {};

    if (!nombre || String(nombre).trim().length < 3) {
      return res.status(400).json({ error: "El nombre del viaje debe tener al menos 3 caracteres." });
    }
    const precioNum = Number(precio);
    if (!precioNum || precioNum <= 0) {
      return res.status(400).json({ error: "Ingresa un precio base válido en pesos colombianos." });
    }

    const cleanId = String(nombre).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const id = `${cleanId}-${Date.now().toString().slice(-4)}`;

    const nuevoViaje = {
      id,
      nombre: String(nombre).trim(),
      ciudad: String(ciudad || nombre).trim(),
      pais: String(pais).trim(),
      categoria,
      emoji: categoria === "playa" ? "🏖️" : (categoria === "naturaleza" ? "🌿" : (categoria === "cultura" ? "🎭" : "🌆")),
      color: "sunset",
      precio: precioNum,
      rating: 5.0,
      duracion: duracion ? `${duracion} días` : "3 días",
      descripcion: descripcion ? String(descripcion).trim() : "Un viaje fascinante diseñado con itinerarios a tu medida.",
      imagen: (imagen && String(imagen).startsWith("http"))
        ? String(imagen).trim()
        : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
      actividades: Array.isArray(actividades) && actividades.length > 0
        ? actividades
        : ["Recorrido turístico guiado", "Degustación gastronómica local", "Tiempo libre para explorar"],
      mejorEpoca: mejorEpoca || "Todo el año"
    };

    destinos.unshift(nuevoViaje);

    res.status(201).json({
      mensaje: "¡Viaje publicado y agregado exitosamente al catálogo!",
      destino: nuevoViaje
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar el nuevo viaje en el catálogo." });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servicio de destinos" });
});

const port = process.env.DESTINOS_PORT || 4001;
app.listen(port, () => console.log(`Destinos service activo en ${port}`));

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "node:crypto";
import { leerReservas, guardarReserva, buscarReservaPorCodigo, cancelarReserva } from "./storage.js";

dotenv.config({ path: "../../.env" });

const app = express();
app.use(cors());
app.use(express.json());

const preciosEstilo = { economico: 1, confort: 1.45, lujo: 2.15 };
const catalogoUrl = process.env.DESTINOS_INTERNAL_URL || "http://localhost:4001";

async function obtenerDestino(id) {
  try {
    const r = await fetch(`${catalogoUrl}/destinos/${encodeURIComponent(id)}`);
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

function validarCotizacion({ personas, dias, estilo }) {
  return Number.isInteger(personas) && personas >= 1 && personas <= 12 &&
    Number.isInteger(dias) && dias >= 1 && dias <= 30 && Object.hasOwn(preciosEstilo, estilo);
}

app.get("/health", (_, res) => res.json({ servicio: "paquetes-service", estado: "ok", persistencia: "json-file" }));

// Cotizar viaje
app.post("/cotizar", async (req, res) => {
  try {
    const { destinoId, personas, dias, estilo = "confort" } = req.body || {};
    if (!destinoId || !validarCotizacion({ personas, dias, estilo })) {
      return res.status(400).json({ error: "Verifica destino, personas (1-12), días (1-30) y estilo (economico, confort, lujo)." });
    }
    const destino = await obtenerDestino(destinoId);
    if (!destino) return res.status(404).json({ error: "El destino seleccionado no existe en el catálogo." });

    const base = destino.precio * personas * (dias / 3);
    const alojamiento = Math.round(base * (preciosEstilo[estilo] - 0.25));
    const experiencias = Math.round(base * 0.22);
    const subtotal = destino.precio * personas + alojamiento + experiencias;
    const impuestos = Math.round(subtotal * 0.08);

    res.json({
      destino,
      personas,
      dias,
      estilo,
      desglose: {
        transporte: destino.precio * personas,
        alojamiento,
        experiencias,
        impuestos
      },
      total: subtotal + impuestos,
      moneda: "COP"
    });
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: "No fue posible consultar el catálogo de destinos." });
  }
});

// Listar todas las reservas (con persistencia)
app.get("/reservas", async (req, res) => {
  try {
    const { buscar, estado } = req.query;
    let listado = await leerReservas();

    if (estado) {
      listado = listado.filter(r => r.estado === estado);
    }
    if (buscar) {
      const q = String(buscar).toLowerCase();
      listado = listado.filter(r =>
        r.codigo.toLowerCase().includes(q) ||
        r.nombre.toLowerCase().includes(q) ||
        r.correo.toLowerCase().includes(q) ||
        r.destino.toLowerCase().includes(q)
      );
    }

    res.json({ reservas: listado, total: listado.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al consultar las reservas registradas." });
  }
});

// Consultar reserva por código
app.get("/reservas/:codigo", async (req, res) => {
  try {
    const reserva = await buscarReservaPorCodigo(req.params.codigo);
    if (!reserva) return res.status(404).json({ error: "Reserva no encontrada con ese código." });
    res.json({ reserva });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al consultar la reserva." });
  }
});

// Cancelar reserva
app.delete("/reservas/:codigo", async (req, res) => {
  try {
    const cancelada = await cancelarReserva(req.params.codigo);
    if (!cancelada) return res.status(404).json({ error: "Reserva no encontrada." });
    res.json({ mensaje: `La reserva ${req.params.codigo} ha sido cancelada.`, reserva: cancelada });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al cancelar la reserva." });
  }
});

// Crear nueva reserva (almacenamiento persistente)
app.post("/reservas", async (req, res) => {
  try {
    const { destinoId, personas, dias, estilo = "confort", nombre, correo, fecha } = req.body || {};

    if (!nombre || String(nombre).trim().length < 3) {
      return res.status(400).json({ error: "Ingresa un nombre completo válido (mínimo 3 caracteres)." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo || "")) {
      return res.status(400).json({ error: "Ingresa un correo electrónico válido." });
    }
    if (!fecha || Number.isNaN(Date.parse(fecha)) || Date.parse(fecha) < Date.now() - 86400000) {
      return res.status(400).json({ error: "Selecciona una fecha futura válida para tu viaje." });
    }
    if (!destinoId || !validarCotizacion({ personas, dias, estilo })) {
      return res.status(400).json({ error: "Los datos de cotización del viaje no son válidos." });
    }

    const destino = await obtenerDestino(destinoId);
    if (!destino) return res.status(404).json({ error: "Destino no encontrado." });

    const base = destino.precio * personas * (dias / 3);
    const alojamiento = Math.round(base * (preciosEstilo[estilo] - 0.25));
    const experiencias = Math.round(base * 0.22);
    const subtotal = destino.precio * personas + alojamiento + experiencias;
    const total = subtotal + Math.round(subtotal * 0.08);

    const codigo = `VY-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const nuevaReserva = {
      codigo,
      nombre: String(nombre).trim(),
      correo: String(correo).trim().toLowerCase(),
      destino: destino.nombre,
      destinoId,
      personas,
      dias,
      estilo,
      fecha,
      total,
      estado: "confirmada",
      creadaEn: new Date().toISOString()
    };

    await guardarReserva(nuevaReserva);

    res.status(201).json({
      mensaje: "¡Tu solicitud de reserva quedó registrada con éxito!",
      reserva: nuevaReserva
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "No fue posible procesar y guardar la reserva." });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servicio de paquetes" });
});

const port = process.env.PAQUETES_PORT || 4002;
app.listen(port, () => console.log(`Paquetes service activo en ${port} con persistencia`));

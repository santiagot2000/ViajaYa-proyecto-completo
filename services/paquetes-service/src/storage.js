import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../data");
const filePath = path.join(dataDir, "reservas.json");

// Asegurar que el directorio de datos existe
async function initStorage() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Error al inicializar almacenamiento de reservas:", err);
  }
}

export async function leerReservas() {
  await initStorage();
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function guardarReserva(nuevaReserva) {
  const reservas = await leerReservas();
  reservas.unshift(nuevaReserva);
  await fs.writeFile(filePath, JSON.stringify(reservas, null, 2), "utf-8");
  return nuevaReserva;
}

export async function buscarReservaPorCodigo(codigo) {
  const reservas = await leerReservas();
  return reservas.find(r => r.codigo.toUpperCase() === codigo.toUpperCase()) || null;
}

export async function cancelarReserva(codigo) {
  const reservas = await leerReservas();
  const index = reservas.findIndex(r => r.codigo.toUpperCase() === codigo.toUpperCase());
  if (index === -1) return null;
  reservas[index].estado = "cancelada";
  reservas[index].canceladaEn = new Date().toISOString();
  await fs.writeFile(filePath, JSON.stringify(reservas, null, 2), "utf-8");
  return reservas[index];
}

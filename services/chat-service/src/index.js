import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config({ path: "../../.env" });

const app = express();
app.use(cors());
app.use(express.json({ limit: "30kb" }));

const catalogoUrl = process.env.DESTINOS_INTERNAL_URL || "http://localhost:4001";

async function catalogo() {
  const r = await fetch(`${catalogoUrl}/destinos`);
  if (!r.ok) throw new Error("Catálogo no disponible");
  return (await r.json()).datos;
}

function formatearCOP(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}

function respuestaReglas(mensaje, destinos) {
  const m = mensaje.toLowerCase().trim();

  // 1. Saludos
  if (/^(hola|buenas|hey|buenos d[ií]as|buenas tardes|buenas noches|saludos)/i.test(m)) {
    return "¡Hola! 👋 Soy tu asesor inteligente de ViajaYa. Puedo recomendarte destinos increíbles, ayudarte a cotizar o explicarte cómo reservar. ¿Qué tipo de viaje estás buscando hoy?";
  }

  // 2. Agradecimientos y despedidas
  if (/gracias|muchas gracias|genial|perfecto|excelente/i.test(m)) {
    return "¡Con todo el gusto! 😊 Recuerda que en la sección 'Cotizador' puedes calcular el costo exacto según viajeros y días, o contactarnos directamente por WhatsApp.";
  }
  if (/chao|adi[oó]s|hasta luego|nos vemos/i.test(m)) {
    return "¡Hasta pronto! Que tengas un excelente día y que tu próximo viaje sea inolvidable. ✈️🎒";
  }

  // 3. Cómo cotizar o reservar
  if (/c[oó]mo (reservo|reservar|cotizo|cotizar)|hacer una reserva|c[oó]digo/i.test(m)) {
    return "Para reservar o cotizar:\n1. Ve a la sección 'Cotiza tu viaje' en esta página.\n2. Elige tu destino, número de personas, días y estilo (Económico, Confort o Lujo).\n3. Verás la inversión estimada y el desglose.\n4. Llena tu nombre, correo y fecha de viaje, y presiona 'Solicitar reserva'. Te daremos un código único (ej: VY-A1B2C3) para consultar tu reserva en el panel.";
  }

  // 4. Medios de pago y qué incluye
  if (/pago|pagar|medios de pago|tarjeta|transferencia/i.test(m)) {
    return "Nuestros planes aceptan transferencia bancaria, tarjetas de crédito/débito y pagos PSE. La cotización en la web genera una solicitud con código único; un asesor valida fechas y te envía el link de pago oficial.";
  }
  if (/qu[eé] incluye|incluye|servicios incluidos/i.test(m)) {
    return "Nuestros paquetes incluyen:\n• Transporte base por persona.\n• Alojamiento según el estilo elegido (Económico, Confort o Lujo).\n• Experiencias y tours destacados de cada destino.\n• Impuestos locales estimados del 8%.\nPuedes ver el desglose exacto en el cotizador.";
  }

  // 5. Destino específico mencionado
  for (const d of destinos) {
    const nombreSimple = d.nombre.toLowerCase();
    const idSimple = d.id.toLowerCase();
    if (m.includes(idSimple) || m.includes(nombreSimple.split(" ")[0])) {
      return `📍 **${d.nombre}** (${d.emoji}):\n${d.descripcion}\n\n• **Precio base:** Desde ${formatearCOP(d.precio)} por persona.\n• **Experiencias:** ${d.actividades.join(", ")}.\n• **Mejor época para visitar:** ${d.mejorEpoca}.\n• **Calificación:** ${d.rating} ★.\n\n¿Quieres que armemos una cotización para este destino?`;
    }
  }

  // 6. Precios y opciones económicas
  if (/precio|cu[aá]nto cuesta|presupuesto|barato|econ[oó]mic/i.test(m)) {
    const baratos = [...destinos].sort((a, b) => a.precio - b.precio).slice(0, 3);
    return `Si buscas cuidar tu bolsillo, nuestros destinos más accesibles son:\n${baratos.map(d => `• ${d.emoji} ${d.nombre}: desde ${formatearCOP(d.precio)} por persona`).join("\n")}\n\nAdemás, en el cotizador puedes activar el estilo 'Económico' para reducir costos de hospedaje.`;
  }

  // 7. Categorías: Playa, Naturaleza, Cultura, Ciudad
  if (/playa|mar|sol|arena|isla/i.test(m)) {
    const playas = destinos.filter(d => d.categoria === "playa");
    return `Para escaparte a la playa te recomiendo ${playas.map(d => `${d.emoji} ${d.nombre}`).join(" o ")}. Tienen mar cálido, gastronomía marina y atardeceres mágicos. ¿Cuál te llama más la atención?`;
  }

  if (/naturaleza|monta[nñ]a|verde|aventura|sender/i.test(m)) {
    const nat = destinos.filter(d => d.categoria === "naturaleza");
    return `Si amas el aire puro y los paisajes verdes, te encantarán:\n${nat.map(d => `• ${d.emoji} ${d.nombre} (${d.duracion})`).join("\n")}\nSon ideales para desconectar y recargar energía.`;
  }

  if (/cultura|historia|museo|patrimonio/i.test(m)) {
    const cult = destinos.filter(d => d.categoria === "cultura");
    return `Para viajes con riqueza cultural e histórica te sugiero:\n${cult.map(d => `• ${d.emoji} ${d.nombre}: ${d.descripcion}`).join("\n")}`;
  }

  if (/ciudad|urbano|nocturn|compras/i.test(m)) {
    const ciud = destinos.filter(d => d.categoria === "ciudad");
    return `Para planes de ciudad vibrante, arte y gastronomía, tu mejor opción es:\n${ciud.map(d => `• ${d.emoji} ${d.nombre}: ${d.actividades.join(", ")}`).join("\n")}`;
  }

  // 8. Sugerencia por defecto con catálogo
  return `Puedo orientarte con cualquiera de nuestros destinos en Colombia: ${destinos.map(d => d.nombre).join(", ")}.\n\nPrueba preguntándome:\n• "¿Cuál es el destino más barato?"\n• "Recomiéndame una playa"\n• "¿Qué actividades hay en Cartagena?"\n• "¿Cómo hago una reserva?"`;
}

app.get("/health", (_, res) => res.json({
  servicio: "chat-service",
  estado: "ok",
  modo: process.env.ANTHROPIC_API_KEY ? "claude" : "reglas-mejoradas"
}));

app.post(["/", "/chat"], async (req, res) => {
  try {
    const mensaje = String(req.body?.mensaje || "").trim();
    if (!mensaje || mensaje.length > 2000) {
      return res.status(400).json({ error: "Escribe un mensaje de hasta 2.000 caracteres." });
    }

    const destinos = await catalogo();

    if (process.env.ANTHROPIC_API_KEY) {
      const cliente = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const historial = Array.isArray(req.body?.historial) ? req.body.historial.slice(-8) : [];
      const contexto = destinos.map(d => `${d.nombre} (${d.categoria}), ${d.precio} COP: ${d.descripcion}. Actividades: ${d.actividades?.join(", ")}. Mejor época: ${d.mejorEpoca}`).join("\n");
      const messages = [
        ...historial.filter(x => ["user", "assistant"].includes(x.role) && typeof x.content === "string").map(x => ({ role: x.role, content: x.content })),
        { role: "user", content: mensaje }
      ];

      const r = await cliente.messages.create({
        model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
        max_tokens: 500,
        system: `Eres el agente de viajes oficial de ViajaYa. Responde en español, con calidez, entusiasmo y precisión. Utiliza el siguiente catálogo real:\n${contexto}`,
        messages
      });

      return res.json({
        respuesta: r.content.filter(c => c.type === "text").map(c => c.text).join("\n"),
        modo: "claude"
      });
    }

    // Modo basado en reglas mejoradas
    res.json({ respuesta: respuestaReglas(mensaje, destinos), modo: "reglas" });
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: "El asistente no está disponible en este momento." });
  }
});

const port = process.env.CHAT_PORT || 4003;
app.listen(port, () => console.log(`Chat service activo en ${port}`));

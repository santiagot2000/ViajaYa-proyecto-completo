# ViajaYa — turismo y viajes

Aplicación full-stack JavaScript con React, Express y cuatro servicios independientes comunicados mediante un gateway REST.

### Requisitos

- Node.js 20 o superior
- npm 10 o superior

### Instalación y ejecución

1. Descomprime el proyecto y abre la carpeta `viajaya` en VS Code.
2. En una terminal ejecuta `npm install` (instala todos los workspaces).
3. Copia `.env.example` como `.env` en la raíz.
4. Opcional: añade `ANTHROPIC_API_KEY` para habilitar Claude y configura `WHATSAPP_NUMBER` con código de país, sin `+` ni espacios.
5. Ejecuta `npm run dev`.
6. Abre `http://localhost:5173`.

### Servicios

| Componente | Puerto | Responsabilidad |
|---|---:|---|
| Gateway | 4000 | Entrada única del API y proxy |
| destinos-service | 4001 | Catálogo, filtros, búsqueda y detalle |
| paquetes-service | 4002 | Cotizador y reservas |
| chat-service | 4003 | Asistente turístico con Claude opcional |
| Frontend (Node.js + Express) | 5173 | Interfaz web y cliente |

El navegador consume únicamente `http://localhost:4000/api`. El gateway enruta las solicitudes a cada microservicio.

### API REST

- `GET /api/destinos?categoria=playa&buscar=cartagena&precioMax=3000000&orden=precio_asc` — Catálogo con filtros y ordenamiento
- `GET /api/destinos/:id` — Detalle de un destino por ID
- `POST /api/destinos` — Crear y publicar un nuevo viaje/destino en el catálogo
- `POST /api/paquetes/cotizar` — `{ "destinoId":"cartagena", "personas":2, "dias":5, "estilo":"confort" }`
- `GET /api/paquetes/reservas` — Listar todas las reservas registradas (persistidas en disco)
- `GET /api/paquetes/reservas/:codigo` — Consultar detalle de reserva por código (ej: `VY-DEMO01`)
- `POST /api/paquetes/reservas` — Crear nueva reserva con persistencia
- `DELETE /api/paquetes/reservas/:codigo` — Cancelar una reserva existente
- `POST /api/chat` — `{ "mensaje":"...", "historial":[] }`

### Notas y Mejoras Aplicadas

- **Persistencia en disco:** Las reservas ahora se guardan de forma persistente en un archivo JSON estructurado en `services/paquetes-service/data/reservas.json`. No se pierden al reiniciar los servicios.
- **Panel de Reservas:** La interfaz web incluye el botón y panel "Mis Reservas" para consultar, filtrar y cancelar solicitudes con un solo clic.
- **Asistente inteligente con reglas ampliadas:** El servicio de chat responde con contexto enriquecido sobre precios, formas de pago, cómo reservar, actividades y sugerencias automáticas incluso sin API Key externa.
- **Ordenamiento dinámico:** Filtro de catálogo por precio menor/mayor y calificación.
- **Notificaciones Toast:** Notificaciones visuales no invasivas en pantalla al interactuar.

### Desarrollo

Cada servicio tiene su propio `package.json` y puede ejecutarse por separado desde la raíz con `npm run dev -w nombre-del-workspace`.

1. Arquitectura del proyecto
El proyecto contiene 19 archivos distribuidos en esta estructura:
ViajaYa/
│
├── package.json
├── .env.example
├── .gitignore
├── README.md
│
├── frontend/
│   ├── package.json
│   ├── server.js
│   └── public/
│       ├── index.html
│       ├── catalogo.html
│       ├── styles.css
│       └── app.js
│
└── services/
    ├── gateway/
    │   ├── package.json
    │   └── src/index.js
    │
    ├── destinos-service/
    │   ├── package.json
    │   └── src/
    │       ├── index.js
    │       └── data.js
    │
    ├── paquetes-service/
    │   ├── package.json
    │   └── src/index.js
    │
    └── chat-service/
        ├── package.json
        └── src/index.js

2. Funcionalidades incluidas
Funcionalidad	Estado
Landing page y hero animado	Incluido
Catálogo de destinos y ordenamiento	Incluido
Filtros por categoría y rango de precio	Incluido
Modal de destinos detallado	Incluido
Cotizador interactivo en tiempo real	Incluido
Registro de reservas persistente (disco)	Incluido
Panel "Mis Reservas" con cancelación	Incluido
Quiz de personalidad viajera	Incluido
Testimonios y sección nosotros	Incluido
Chat inteligente con IA y reglas avanzadas	Incluido
Notificaciones Toast en pantalla	Incluido
WhatsApp conectado al Gateway	Incluido
Diseño responsive y sin Vite (100% Node.js)	Incluido

3. Cómo ejecutarlo en tu computador
Como trabajas con VS Code, te recomiendo hacerlo así:

Paso 1. Descarga y descomprime el ZIP.

Paso 2. Abre la carpeta ViajaYa directamente en VS Code.

Paso 3. Abre la terminal y ejecuta:
npm install

Paso 4. Copia .env.example y crea un archivo .env en la raíz.

Paso 5. Ejecuta todo el ecosistema:
npm run dev

Paso 6. Abre el navegador:
ViajaYa
Frontend

http://localhost:5173
API Gateway: http://localhost:4000

Los servicios funcionan en estos puertos:
- 4000: Gateway.
- 4001: Destinos.
- 4002: Paquetes y reservas.
- 4003: Chat.
- 5173: Frontend (Servidor Node.js + Express).
4. Importante antes de utilizarlo
Hay tres consideraciones:
1. El catálogo viene con destinos y precios demostrativos de Colombia.
2. Las reservas se almacenan en memoria; todavía no hay una base de datos persistente.
3. Claude requiere configurar ANTHROPIC_API_KEY. Sin ella, el chat utiliza respuestas automáticas basadas en el catálogo real.
// ViajaYa - Cliente Web Vanilla JS (Node.js)
const API = "http://localhost:4000/api";
const GATEWAY = "http://localhost:4000";

const COP = n => new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
}).format(n || 0);

// Catálogo base con 5 ciudades principales y destinos de Colombia
const defaultDestinations = [
  {
    id: "cartagena",
    nombre: "Cartagena de Indias",
    ciudad: "Cartagena",
    pais: "Colombia",
    categoria: "playa",
    emoji: "🏝️",
    color: "sunset",
    precio: 1450000,
    rating: 4.9,
    duracion: "4 días",
    descripcion: "Calles coloniales empedradas, balcones floridos y atardeceres caribeños frente a la muralla.",
    imagen: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&w=800&q=80",
    actividades: ["Ciudad amurallada", "Islas del Rosario", "Atardecer en velero", "Castillo San Felipe"],
    mejorEpoca: "Diciembre a abril"
  },
  {
    id: "medellin",
    nombre: "Medellín Innovadora",
    ciudad: "Medellín",
    pais: "Colombia",
    categoria: "ciudad",
    emoji: "🌆",
    color: "violet",
    precio: 890000,
    rating: 4.9,
    duracion: "3 días",
    descripcion: "La ciudad de la eterna primavera: arte urbano, gastronomía de autor, innovación y montañas verdes.",
    imagen: "https://images.unsplash.com/photo-1579282240050-352db0a14c21?auto=format&fit=crop&w=800&q=80",
    actividades: ["Comuna 13 y Graffitour", "Metrocable y Parque Arví", "Poblado y Provenza", "Plaza Botero"],
    mejorEpoca: "Todo el año"
  },
  {
    id: "bogota",
    nombre: "Bogotá Histórica y Cultural",
    ciudad: "Bogotá",
    pais: "Colombia",
    categoria: "cultura",
    emoji: "🏛️",
    color: "rose",
    precio: 760000,
    rating: 4.7,
    duracion: "3 días",
    descripcion: "Museos de talla mundial, arquitectura colonial, cafés de origen y el mirador icónico de Monserrate.",
    imagen: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
    actividades: ["Museo del Oro", "Barrio La Candelaria", "Cerro de Monserrate", "Chorro de Quevedo"],
    mejorEpoca: "Todo el año"
  },
  {
    id: "santamarta",
    nombre: "Santa Marta y Tayrona",
    ciudad: "Santa Marta",
    pais: "Colombia",
    categoria: "naturaleza",
    emoji: "🌿",
    color: "forest",
    precio: 980000,
    rating: 4.8,
    duracion: "4 días",
    descripcion: "La magia de la Sierra Nevada que desciende hasta playas cristalinas de arena dorada en el Caribe.",
    imagen: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
    actividades: ["Parque Nacional Tayrona", "Playa Cristal", "Cascadas de Minca", "Bahía Concha"],
    mejorEpoca: "Diciembre a mayo"
  },
  {
    id: "cali",
    nombre: "Cali Capital de la Salsa",
    ciudad: "Cali",
    pais: "Colombia",
    categoria: "ciudad",
    emoji: "💃",
    color: "sunset",
    precio: 820000,
    rating: 4.8,
    duracion: "3 días",
    descripcion: "Alegría, compás y sabor: la capital mundial de la salsa te recibe con brisa, baile y gastronomía vallecaucana.",
    imagen: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    actividades: ["Clases de Salsa en San Antonio", "Monumento a Cristo Rey", "Bulevar del Río", "Museo La Tertulia"],
    mejorEpoca: "Junio a septiembre, Diciembre"
  },
  {
    id: "sanandres",
    nombre: "San Andrés Islas",
    ciudad: "San Andrés",
    pais: "Colombia",
    categoria: "playa",
    emoji: "🐠",
    color: "ocean",
    precio: 1890000,
    rating: 4.8,
    duracion: "5 días",
    descripcion: "Un mar de siete colores inigualable, barreras de coral para careteo y descanso absoluto frente a las olas.",
    imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    actividades: ["Cayo Johnny Cay", "El Acuario natural", "Cueva de Morgan", "Vuelta en mulita a la isla"],
    mejorEpoca: "Diciembre a mayo"
  },
  {
    id: "salento",
    nombre: "Valle del Cocora y Salento",
    ciudad: "Salento",
    pais: "Colombia",
    categoria: "naturaleza",
    emoji: "🌴",
    color: "mint",
    precio: 1120000,
    rating: 4.9,
    duracion: "3 días",
    descripcion: "Palmas de cera gigantes que tocan las nubes, aroma a café recién tostado y arquitectura tradicional paisa.",
    imagen: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
    actividades: ["Caminata Valle del Cocora", "Tour en Finca Cafetera", "Miradores de Salento", "Pueblo de Filandia"],
    mejorEpoca: "Todo el año"
  },
  {
    id: "guatape",
    nombre: "Guatapé y Peñol",
    ciudad: "Guatapé",
    pais: "Colombia",
    categoria: "naturaleza",
    emoji: "🛶",
    color: "aqua",
    precio: 620000,
    rating: 4.8,
    duracion: "2 días",
    descripcion: "Sube los 700 escalones de la Piedra del Peñol para contemplar el embalse y recorre las calles de zócalos coloridos.",
    imagen: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    actividades: ["Subida a la Piedra del Peñol", "Paseo en lancha o pontón", "Plazoleta de los Zócalos", "Calle del Recuerdo"],
    mejorEpoca: "Todo el año"
  }
];

// Estado global de la aplicación
let allDestinations = [...defaultDestinations];
let selectedCategory = "todos";
let searchTerm = "";
let maxPrice = 2500000;
let currentSort = "default";
let currentQuote = null;
let selectedStyle = "confort";
let whatsappNumber = "573001234567";
let allReservas = [];

// Historial del chat
let chatHistory = [
  { role: "assistant", content: "¡Hola! 👋 Soy tu compañero de ViajaYa. ¿Te ayudo a encontrar tu próximo destino?" }
];

document.addEventListener("DOMContentLoaded", () => {
  initIcons();
  initReveal();
  initHeader();
  initHero();
  initFilters();
  populateDestinationsDropdown();
  renderDestinations();
  initQuote();
  initQuiz();
  initChat();
  initNewsletter();
  initReservasPanel();
  initCrearViajeModal();
  fetchConfig();
  fetchDestinations();
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

function initIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Sistema de Notificaciones Toast
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const iconName = type === "success" ? "check-circle-2" : (type === "error" ? "alert-circle" : "info");
  toast.innerHTML = `<i data-lucide="${iconName}" style="width:16px;height:16px;"></i><span>${message}</span>`;
  container.appendChild(toast);
  initIcons();

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

// Observador para animaciones al hacer scroll
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

// Navegación y header
function initHeader() {
  const header = document.getElementById("header");
  const toggle = document.getElementById("mobile-toggle");
  const nav = document.getElementById("nav");

  if (header && !header.classList.contains("scrolled")) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 24) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  toggle?.addEventListener("click", () => {
    nav?.classList.toggle("open");
  });

  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open");
    });
  });
}

// Animaciones del Hero
function initHero() {
  const words = ["inolvidables", "a tu manera", "llenas de vida", "que te transforman"];
  let wordIndex = 0;
  const wordEl = document.getElementById("rotating-word");

  if (wordEl) {
    setInterval(() => {
      wordIndex = (wordIndex + 1) % words.length;
      wordEl.textContent = words[wordIndex];
    }, 2600);
  }

  animateCount("stat-destinos", 28, "+");
  animateCount("stat-rating", 4.9, "", "★", 1);
  animateCount("stat-viajeros", 12, "+", "k");

  const form = document.getElementById("hero-search-form");
  const input = document.getElementById("hero-search-input");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim();
    searchTerm = val;
    const filterInput = document.getElementById("filter-search");
    if (filterInput) filterInput.value = val;
    renderDestinations();
    document.getElementById("destinos")?.scrollIntoView({ behavior: "smooth" });
  });
}

function animateCount(id, target, prefix = "", suffix = "", decimals = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  const duration = 1300;
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = (target * ease);
    el.textContent = `${prefix}${decimals > 0 ? current.toFixed(decimals) : Math.floor(current)}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${prefix}${decimals > 0 ? target.toFixed(decimals) : target}${suffix}`;
    }
  }
  requestAnimationFrame(step);
}

// Cargar configuración de WhatsApp desde Gateway
async function fetchConfig() {
  try {
    const res = await fetch(`${GATEWAY}/config`);
    if (res.ok) {
      const data = await res.json();
      if (data.whatsappNumber) whatsappNumber = data.whatsappNumber;
    }
  } catch (err) {
    console.warn("No se pudo cargar la configuración de WhatsApp:", err);
  }
}

// Cargar destinos desde el Gateway (con fallback inmediato)
async function fetchDestinations() {
  try {
    const res = await fetch(`${API}/destinos`);
    if (res.ok) {
      const json = await res.json();
      if (json.datos && json.datos.length > 0) {
        allDestinations = json.datos;
        populateDestinationsDropdown();
        renderDestinations();
        recalculateQuote();
      }
    }
  } catch (err) {
    console.warn("Servicio de destinos aún conectando, usando catálogo local.");
  }
}

// Filtros, búsqueda y ordenamiento
function initFilters() {
  const tabs = document.querySelectorAll("#category-tabs button");
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedCategory = btn.getAttribute("data-cat");
      renderDestinations();
    });
  });

  const searchInput = document.getElementById("filter-search");
  searchInput?.addEventListener("input", (e) => {
    searchTerm = e.target.value.trim();
    renderDestinations();
  });

  const priceInput = document.getElementById("price-filter-input");
  const priceLabel = document.getElementById("price-filter-label");
  priceInput?.addEventListener("input", (e) => {
    maxPrice = Number(e.target.value);
    if (priceLabel) priceLabel.textContent = `Hasta ${COP(maxPrice)}`;
    renderDestinations();
  });

  const sortSelect = document.getElementById("filter-sort");
  sortSelect?.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderDestinations();
  });
}

function renderDestinations() {
  const grid = document.getElementById("destinations-grid");
  const countLabel = document.getElementById("destinations-count");
  if (!grid) return;

  let filtered = allDestinations.filter(d => {
    const matchesCategory = selectedCategory === "todos" || d.categoria === selectedCategory;
    const matchesSearch = `${d.nombre} ${d.ciudad || ""} ${d.pais} ${d.descripcion}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = d.precio <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  if (currentSort === "precio_asc") {
    filtered.sort((a, b) => a.precio - b.precio);
  } else if (currentSort === "precio_desc") {
    filtered.sort((a, b) => b.precio - a.precio);
  } else if (currentSort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (countLabel) {
    countLabel.textContent = `Mostrando ${filtered.length} destinos para inspirarte`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state">No encontramos destinos con esos filtros. Prueba otra categoría o amplía el presupuesto.</div>`;
    return;
  }

  grid.innerHTML = filtered.map((d, i) => `
    <article class="destination-card reveal visible card-${d.color || 'sunset'}" style="transition-delay:${i * 45}ms">
      <div class="destination-visual">
        <img src="${d.imagen}" alt="${d.nombre}" class="dest-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'" />
        <div class="visual-overlay"></div>
        <span class="visual-index">0${i + 1}</span>
        <span class="visual-category">${d.ciudad || d.categoria}</span>
        <span class="visual-emoji-badge">${d.emoji}</span>
      </div>
      <div class="destination-info">
        <div class="destination-meta">
          <span><i data-lucide="map-pin" style="width:13px;height:13px;"></i>${d.ciudad || d.pais}</span>
          <span><i data-lucide="star" style="width:13px;height:13px;fill:currentColor;"></i>${d.rating}</span>
        </div>
        <h3>${d.nombre}</h3>
        <p>${d.descripcion}</p>
        <div class="destination-foot">
          <div>
            <small>Desde</small>
            <strong>${COP(d.precio)}</strong>
          </div>
          <button aria-label="Ver detalles de ${d.nombre}" onclick="openDetailModal('${d.id}')">
            <i data-lucide="arrow-up-right" style="width:20px;height:20px;"></i>
          </button>
        </div>
      </div>
    </article>
  `).join("");

  initIcons();
}

// Modal de Detalle con Imagen Real
window.openDetailModal = function(id) {
  const dest = allDestinations.find(d => d.id === id);
  if (!dest) return;

  const backdrop = document.getElementById("detail-modal-backdrop");
  const art = document.getElementById("modal-art");

  art.className = `modal-art card-${dest.color || 'sunset'}`;
  art.innerHTML = `
    <img src="${dest.imagen}" alt="${dest.nombre}" class="modal-bg-img" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'" />
    <div class="modal-art-overlay"></div>
    <div class="modal-art-content">
      <span>${dest.emoji}</span>
      <small>VIAJAYA · ${dest.ciudad ? dest.ciudad.toUpperCase() : 'COLOMBIA'}</small>
    </div>
  `;

  document.getElementById("modal-pais").textContent = dest.ciudad ? `${dest.ciudad}, ${dest.pais}` : dest.pais;
  document.getElementById("modal-rating").textContent = dest.rating;
  document.getElementById("modal-dest-title").textContent = dest.nombre;
  document.getElementById("modal-dest-desc").textContent = dest.descripcion;
  document.getElementById("modal-dest-price").textContent = COP(dest.precio);

  const actList = document.getElementById("modal-activities");
  actList.innerHTML = (dest.actividades || []).map(a => `<span>✦ ${a}</span>`).join("");

  const quoteBtn = document.getElementById("modal-quote-btn");
  quoteBtn.onclick = () => {
    closeDetailModal();
    const select = document.getElementById("quote-destination");
    if (select) {
      select.value = dest.id;
      recalculateQuote();
      showToast(`Destino cargado en el cotizador: ${dest.nombre}`, "info");
      document.getElementById("cotizador")?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#cotizador`;
    }
  };

  backdrop.style.display = "grid";
  initIcons();
};

function closeDetailModal() {
  const modal = document.getElementById("detail-modal-backdrop");
  if (modal) modal.style.display = "none";
}

document.getElementById("modal-close-btn")?.addEventListener("click", closeDetailModal);
document.getElementById("detail-modal-backdrop")?.addEventListener("mousedown", (e) => {
  if (e.target.id === "detail-modal-backdrop") closeDetailModal();
});

// Modal para Crear Nuevo Viaje
function initCrearViajeModal() {
  const openBtn = document.getElementById("open-crear-viaje-btn");
  const modal = document.getElementById("crear-viaje-modal");
  const closeBtn = document.getElementById("crear-viaje-close-btn");
  const cancelBtn = document.getElementById("crear-viaje-cancel-btn");
  const form = document.getElementById("form-crear-viaje");

  openBtn?.addEventListener("click", () => {
    modal.style.display = "grid";
  });

  const closeModal = () => {
    if (modal) modal.style.display = "none";
  };
  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("mousedown", (e) => {
    if (e.target.id === "crear-viaje-modal") closeModal();
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nuevo-nombre").value.trim();
    const ciudad = document.getElementById("nuevo-ciudad").value.trim();
    const categoria = document.getElementById("nuevo-categoria").value;
    const precio = document.getElementById("nuevo-precio").value;
    const duracion = document.getElementById("nuevo-dias").value;
    const mejorEpoca = document.getElementById("nuevo-epoca").value.trim();
    const imagen = document.getElementById("nuevo-imagen").value.trim();
    const descripcion = document.getElementById("nuevo-desc").value.trim();
    const actividadesRaw = document.getElementById("nuevo-actividades").value.trim();
    const actividades = actividadesRaw ? actividadesRaw.split(",").map(a => a.trim()).filter(Boolean) : [];

    try {
      const res = await fetch(`${API}/destinos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          ciudad,
          categoria,
          precio,
          duracion,
          mejorEpoca,
          imagen,
          descripcion,
          actividades
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo registrar el viaje");

      allDestinations.unshift(data.destino);
      renderDestinations();
      populateDestinationsDropdown();
      closeModal();
      form.reset();
      showToast(`¡Viaje a ${data.destino.nombre} publicado con éxito!`, "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  });
}

// Cotizador y Reservas
function populateDestinationsDropdown() {
  const select = document.getElementById("quote-destination");
  if (!select) return;
  select.innerHTML = allDestinations.map(d => `<option value="${d.id}">${d.emoji} ${d.nombre}</option>`).join("");
  if (allDestinations.length > 0 && !select.value) {
    select.value = allDestinations[0].id;
  }
}

function initQuote() {
  const select = document.getElementById("quote-destination");
  const travelersInput = document.getElementById("quote-travelers");
  const travelersVal = document.getElementById("quote-travelers-val");
  const daysInput = document.getElementById("quote-days");
  const daysVal = document.getElementById("quote-days-val");
  const styleButtons = document.querySelectorAll("#style-options button");
  if (!select) return;

  select.addEventListener("change", recalculateQuote);

  travelersInput?.addEventListener("input", (e) => {
    const v = Number(e.target.value);
    travelersVal.innerHTML = `<i data-lucide="users" style="width:16px;height:16px;"></i>${v} ${v === 1 ? "persona" : "personas"}`;
    initIcons();
    recalculateQuote();
  });

  daysInput?.addEventListener("input", (e) => {
    const v = Number(e.target.value);
    daysVal.innerHTML = `<i data-lucide="calendar-days" style="width:16px;height:16px;"></i>${v} días`;
    initIcons();
    recalculateQuote();
  });

  styleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      styleButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedStyle = btn.getAttribute("data-style");
      recalculateQuote();
    });
  });

  const form = document.getElementById("booking-form");
  const errEl = document.getElementById("booking-error");
  const successBox = document.getElementById("booking-success");
  const codeEl = document.getElementById("booking-code");
  const resetBtn = document.getElementById("booking-reset-btn");

  const dateInput = document.getElementById("booking-date");
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().slice(0, 10);
    dateInput.value = tomorrow.toISOString().slice(0, 10);
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (errEl) errEl.style.display = "none";

    const payload = {
      destinoId: select.value,
      personas: Number(travelersInput.value),
      dias: Number(daysInput.value),
      estilo: selectedStyle,
      nombre: document.getElementById("booking-name").value.trim(),
      correo: document.getElementById("booking-email").value.trim(),
      fecha: dateInput.value
    };

    try {
      const res = await fetch(`${API}/paquetes/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo registrar la reserva");

      form.style.display = "none";
      successBox.style.display = "flex";
      const code = data.reserva?.codigo || "CONFIRMADO";
      if (codeEl) codeEl.textContent = code;

      showToast(`¡Reserva ${code} guardada en el sistema!`, "success");
      initIcons();
    } catch (err) {
      if (errEl) {
        errEl.textContent = err.message;
        errEl.style.display = "block";
      }
      showToast(err.message, "error");
    }
  });

  resetBtn?.addEventListener("click", () => {
    form.reset();
    form.style.display = "block";
    successBox.style.display = "none";
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateInput) dateInput.value = tomorrow.toISOString().slice(0, 10);
  });
}

let quoteTimeout = null;
function recalculateQuote() {
  clearTimeout(quoteTimeout);
  quoteTimeout = setTimeout(async () => {
    const select = document.getElementById("quote-destination");
    const travelersInput = document.getElementById("quote-travelers");
    const daysInput = document.getElementById("quote-days");
    const destNameEl = document.getElementById("quote-destination-name");
    const totalEl = document.getElementById("quote-total-amount");
    const breakdown = document.getElementById("price-breakdown");
    if (!select || !destNameEl || !totalEl) return;

    const destinoId = select.value;
    if (!destinoId) return;

    const dest = allDestinations.find(d => d.id === destinoId);
    if (dest) destNameEl.textContent = dest.nombre;

    totalEl.textContent = "Calculando...";

    try {
      const res = await fetch(`${API}/paquetes/cotizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinoId,
          personas: Number(travelersInput.value),
          dias: Number(daysInput.value),
          estilo: selectedStyle
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      currentQuote = data;
      totalEl.textContent = COP(data.total);

      if (breakdown) {
        breakdown.style.display = "grid";
        document.getElementById("bk-transporte").textContent = COP(data.desglose.transporte);
        document.getElementById("bk-alojamiento").textContent = COP(data.desglose.alojamiento);
        document.getElementById("bk-experiencias").textContent = COP(data.desglose.experiencias);
        document.getElementById("bk-impuestos").textContent = COP(data.desglose.impuestos);
      }
    } catch (err) {
      totalEl.textContent = "—";
      if (breakdown) breakdown.style.display = "none";
    }
  }, 150);
}

// Panel de Reservas
function initReservasPanel() {
  const openBtn = document.getElementById("open-reservas-btn");
  const modal = document.getElementById("reservas-modal-backdrop");
  const closeBtn = document.getElementById("reservas-close-btn");
  const searchInput = document.getElementById("reservas-search-input");

  openBtn?.addEventListener("click", () => {
    modal.style.display = "grid";
    cargarReservas();
  });

  closeBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal?.addEventListener("mousedown", (e) => {
    if (e.target.id === "reservas-modal-backdrop") {
      modal.style.display = "none";
    }
  });

  searchInput?.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    renderListaReservas(q);
  });
}

async function cargarReservas() {
  const container = document.getElementById("reservas-list");
  if (!container) return;
  container.innerHTML = `<div class="empty-bookings"><p>Cargando reservas...</p></div>`;

  try {
    const res = await fetch(`${API}/paquetes/reservas`);
    if (!res.ok) throw new Error("No se pudieron cargar las reservas");
    const data = await res.json();
    allReservas = data.reservas || [];
    renderListaReservas();
  } catch (err) {
    container.innerHTML = `<div class="empty-bookings"><p style="color:#d32f2f;">Error al consultar las reservas registradas.</p></div>`;
  }
}

function renderListaReservas(filtro = "") {
  const container = document.getElementById("reservas-list");
  if (!container) return;

  let filtradas = allReservas;
  if (filtro) {
    filtradas = allReservas.filter(r =>
      r.codigo.toLowerCase().includes(filtro) ||
      r.nombre.toLowerCase().includes(filtro) ||
      r.destino.toLowerCase().includes(filtro) ||
      r.correo.toLowerCase().includes(filtro)
    );
  }

  if (filtradas.length === 0) {
    container.innerHTML = `
      <div class="empty-bookings">
        <i data-lucide="calendar-x" style="width:36px;height:36px;margin:auto;"></i>
        <p>${filtro ? "No hay reservas que coincidan con la búsqueda." : "Aún no hay reservas registradas en el sistema. ¡Cotiza y solicita la primera!"}</p>
      </div>
    `;
    initIcons();
    return;
  }

  container.innerHTML = filtradas.map(r => `
    <article class="booking-card">
      <div class="booking-card-head">
        <span class="booking-code-tag">
          ${r.codigo}
          <button type="button" class="booking-copy-btn" title="Copiar código" onclick="copyBookingCode('${r.codigo}')">
            <i data-lucide="copy" style="width:14px;height:14px;"></i>
          </button>
        </span>
        <span class="booking-badge ${r.estado || 'confirmada'}">${r.estado || 'confirmada'}</span>
      </div>

      <div class="booking-card-body">
        <div><span>Destino:</span><b>${r.destino}</b></div>
        <div><span>Titular:</span><b>${r.nombre}</b></div>
        <div><span>Correo:</span><b>${r.correo}</b></div>
        <div><span>Fecha viaje:</span><b>${r.fecha}</b></div>
        <div><span>Plan:</span><b>${r.personas} viajeros · ${r.dias} días</b></div>
        <div><span>Estilo:</span><b style="text-transform:capitalize;">${r.estilo}</b></div>
      </div>

      <div class="booking-card-foot">
        <div>
          <small style="color:#8f9aa9;font-size:10px;">Total cotizado</small>
          <strong>${COP(r.total)}</strong>
        </div>
        ${r.estado !== 'cancelada' ? `
          <button type="button" class="booking-cancel-btn" onclick="cancelBooking('${r.codigo}')">
            Cancelar reserva
          </button>
        ` : `<span style="font-size:11px;color:#c53030;font-weight:600;">Cancelada</span>`}
      </div>
    </article>
  `).join("");

  initIcons();
}

window.copyBookingCode = function(codigo) {
  navigator.clipboard.writeText(codigo).then(() => {
    showToast(`Código ${codigo} copiado al portapapeles`, "info");
  }).catch(() => {
    showToast(`Código: ${codigo}`, "info");
  });
};

window.cancelBooking = async function(codigo) {
  if (!confirm(`¿Estás seguro de que deseas cancelar la reserva ${codigo}?`)) return;

  try {
    const res = await fetch(`${API}/paquetes/reservas/${encodeURIComponent(codigo)}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo cancelar la reserva");

    showToast(`Reserva ${codigo} cancelada`, "info");
    await cargarReservas();
  } catch (err) {
    showToast(err.message, "error");
  }
};

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeDetailModal();
    const modalRes = document.getElementById("reservas-modal-backdrop");
    if (modalRes) modalRes.style.display = "none";
    const modalCrear = document.getElementById("crear-viaje-modal");
    if (modalCrear) modalCrear.style.display = "none";
  }
});

// Quiz de Personalidad Viajera
function initQuiz() {
  const questions = [
    {
      q: "¿Qué paisaje te hace desconectar?",
      a: [
        ["Mar turquesa y arena", "playa"],
        ["Montañas y senderos", "naturaleza"],
        ["Calles llenas de historia", "cultura"],
        ["Luces y movimiento", "ciudad"]
      ]
    },
    {
      q: "Tu plan perfecto es...",
      a: [
        ["Sol, música y agua", "playa"],
        ["Una ruta y aire puro", "naturaleza"],
        ["Museos, sabores y arte", "cultura"],
        ["Cafés, compras y rooftops", "ciudad"]
      ]
    },
    {
      q: "¿Qué recuerdo quieres llevar?",
      a: [
        ["Un atardecer frente al mar", "playa"],
        ["Una vista que quite el aliento", "naturaleza"],
        ["Una historia que contar", "cultura"],
        ["La energía de una nueva ciudad", "ciudad"]
      ]
    }
  ];

  let currentStep = 0;
  let answers = [];

  const stepLabel = document.getElementById("quiz-step-label");
  const progressBar = document.getElementById("quiz-progress-bar");
  const questionBox = document.getElementById("quiz-question-box");
  const questionText = document.getElementById("quiz-question-text");
  const optionsBox = document.getElementById("quiz-options");
  const resultBox = document.getElementById("quiz-result-box");
  const resetBtn = document.getElementById("quiz-reset-btn");
  if (!stepLabel || !questionText) return;

  function renderStep() {
    stepLabel.textContent = `PREGUNTA 0${currentStep + 1} / 03`;
    progressBar.style.width = `${((currentStep + 1) / questions.length) * 100}%`;
    questionText.textContent = questions[currentStep].q;

    optionsBox.innerHTML = questions[currentStep].a.map(([label, val]) => `
      <button type="button" data-val="${val}">
        ${label}
        <i data-lucide="arrow-up-right" style="width:17px;height:17px;"></i>
      </button>
    `).join("");

    optionsBox.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        answers.push(btn.getAttribute("data-val"));
        if (currentStep + 1 < questions.length) {
          currentStep++;
          renderStep();
        } else {
          showResult();
        }
      });
    });

    initIcons();
  }

  function showResult() {
    stepLabel.textContent = "COMPLETADO";
    progressBar.style.width = "100%";
    questionBox.style.display = "none";
    resultBox.style.display = "block";

    const counts = answers.reduce((acc, v) => {
      acc[v] = (acc[v] || 0) + 1;
      return acc;
    }, {});
    const topCategory = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "naturaleza";
    const recommended = allDestinations.find(d => d.categoria === topCategory) || allDestinations[0];

    document.getElementById("quiz-res-emoji").textContent = recommended?.emoji || "🧭";
    document.getElementById("quiz-res-name").textContent = recommended?.nombre || "Una nueva aventura";
    document.getElementById("quiz-res-desc").textContent = recommended?.descripcion || "Destino ideal para ti.";
    initIcons();
  }

  resetBtn?.addEventListener("click", () => {
    currentStep = 0;
    answers = [];
    resultBox.style.display = "none";
    questionBox.style.display = "block";
    renderStep();
  });

  renderStep();
}

// Asistente Inteligente (Chat)
function initChat() {
  const fab = document.getElementById("chat-fab");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close-btn");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const messagesBox = document.getElementById("chat-messages");
  const prompts = document.querySelectorAll("#quick-prompts button");
  const waLink = document.getElementById("whatsapp-chat-link");

  let isTyping = false;

  function toggleChat(open) {
    if (!panel || !fab) return;
    panel.style.display = open ? "flex" : "none";
    fab.setAttribute("aria-label", open ? "Cerrar chat" : "Abrir asistente");
    if (open && input) {
      input.focus();
      updateWhatsAppLink();
    }
  }

  fab?.addEventListener("click", () => {
    const isVisible = panel.style.display === "flex";
    toggleChat(!isVisible);
  });

  closeBtn?.addEventListener("click", () => {
    toggleChat(false);
  });

  prompts.forEach(p => {
    p.addEventListener("click", () => {
      sendMessage(p.getAttribute("data-prompt"));
    });
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
      sendMessage(text);
      input.value = "";
    }
  });

  async function sendMessage(text) {
    if (!text || isTyping) return;

    chatHistory.push({ role: "user", content: text });
    appendBubble("user", text);
    updateWhatsAppLink();

    isTyping = true;
    const typingBubble = document.createElement("div");
    typingBubble.className = "chat-bubble assistant typing";
    typingBubble.innerHTML = "<i></i><i></i><i></i>";
    messagesBox.appendChild(typingBubble);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensaje: text,
          historial: chatHistory.slice(-8)
        })
      });
      const data = await res.json();
      typingBubble.remove();

      const reply = res.ok ? data.respuesta : (data.error || "No pude responder en este momento.");
      chatHistory.push({ role: "assistant", content: reply });
      appendBubble("assistant", reply);
      updateWhatsAppLink();
    } catch (err) {
      typingBubble.remove();
      const errorMsg = "No logro conectar con el servidor ahora. Inténtalo de nuevo en un momento.";
      chatHistory.push({ role: "assistant", content: errorMsg });
      appendBubble("assistant", errorMsg);
      updateWhatsAppLink();
    } finally {
      isTyping = false;
    }
  }

  function appendBubble(role, content) {
    if (!messagesBox) return;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${role}`;
    bubble.textContent = content;
    messagesBox.appendChild(bubble);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  function updateWhatsAppLink() {
    if (!waLink) return;
    const convText = chatHistory.map(m => `${m.role === "user" ? "Tú" : "ViajaYa"}: ${m.content}`).join("\n");
    const fullMsg = `Hola ViajaYa, quiero información sobre mi viaje.\n\n${convText}`;
    waLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullMsg)}`;
  }
}

// Newsletter
function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  const ok = document.getElementById("newsletter-ok");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    form.querySelector("input").value = "";
    if (ok) ok.style.display = "block";
    showToast("¡Te has suscrito al boletín de ViajaYa!", "success");
    setTimeout(() => { if (ok) ok.style.display = "none"; }, 4000);
  });
}

/**
 * admin.js - Lógica del panel de administración
 * 
 * Funcionalidades:
 *  1. FAVORITOS: Gestión de juegos favoritos con LocalStorage.
 *     - Al cargar la página se muestran solo los favoritos (si los hay).
 *     - Enlace "Todos los Juegos" / "Mis Favoritos" en el navbar cambia la vista.
 *     - Botón ★ en cada tarjeta añade/quita el juego de favoritos.
 * 
 *  2. AJAX - Formulario de inserción:
 *     - El formulario #form-insertar envía los datos con fetch().
 *     - Si tiene éxito, renderiza la nueva tarjeta en el grid sin recargar.
 * 
 *  3. Confirmación de logout y eliminación de juegos.
 */

'use strict';

/* ============================================================
   CONSTANTES Y ESTADO GLOBAL
   ============================================================ */

const STORAGE_KEY = 'gc_favoritos'; // clave en LocalStorage

/** @returns {number[]} Array de IDs favoritos */
function getFavoritos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (_) {
    return [];
  }
}

/** Guarda el array de IDs favoritos en LocalStorage */
function setFavoritos(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

/** Alterna el estado favorito de un ID */
function toggleFavorito(id) {
  const lista = getFavoritos();
  const idx = lista.indexOf(id);
  if (idx === -1) {
    lista.push(id);
  } else {
    lista.splice(idx, 1);
  }
  setFavoritos(lista);
  return lista.includes(id); // devuelve el nuevo estado
}

/* ============================================================
   VISTA ACTUAL: 'todos' | 'favoritos'
   ============================================================ */

let vistaActual = 'todos'; // se determinará al cargar

/* ============================================================
   UTILIDADES DE RENDERIZADO DE TARJETAS
   ============================================================ */

/**
 * Genera el HTML de una tarjeta de videojuego a partir de un objeto juego.
 * Se usa al insertar un juego via AJAX para añadirlo al DOM.
 */
function generarTarjetaHTML(juego) {
  const fecha = new Date(juego.fecha_creacion).toLocaleDateString('es-ES');

  let colorEstado = 'bg-secondary';
  let iconoEstado = 'bi-clock';
  if (juego.estado === 'Jugando')   { colorEstado = 'bg-primary';             iconoEstado = 'bi-play-fill'; }
  if (juego.estado === 'Terminado') { colorEstado = 'bg-success';             iconoEstado = 'bi-check-circle-fill'; }
  if (juego.estado === 'Pendiente') { colorEstado = 'bg-warning text-dark';   iconoEstado = 'bi-hourglass-split'; }

  return `
    <div class="col fade-in juego-card" data-id="${juego.id}">
      <div class="card h-100 hover-lift">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span class="badge bg-dark">
            <i class="bi bi-controller me-1"></i>
            ${escapeHTML(juego.plataforma)}
          </span>
          <div class="d-flex align-items-center gap-2">
            <span class="badge ${colorEstado}">
              <i class="${iconoEstado} me-1"></i>
              ${escapeHTML(juego.estado)}
            </span>
            <button class="btn-fav" data-id="${juego.id}" title="Marcar como favorito" aria-label="Favorito">
              <i class="bi bi-star-fill"></i>
            </button>
          </div>
        </div>
        <div class="card-body">
          <h5 class="card-title text-white fw-bold mb-2">${escapeHTML(juego.titulo)}</h5>
          <p class="text-secondary small mb-2">
            <i class="bi bi-tag me-1"></i>
            ${escapeHTML(juego.genero || 'Sin género')}
          </p>
          <p class="text-muted" style="font-size:0.75rem;">
            <i class="bi bi-calendar3 me-1"></i>
            Añadido: ${fecha}
          </p>
        </div>
        <div class="card-footer d-flex justify-content-end gap-2">
          <a href="/videojuegos/editar/${juego.id}" class="btn btn-sm btn-outline-light hover-lift">
            <i class="bi bi-pencil-fill"></i>
            <span class="d-none d-sm-inline ms-1">Editar</span>
          </a>
          <form action="/videojuegos/eliminar" method="POST" class="d-inline form-eliminar">
            <input type="hidden" name="id" value="${juego.id}">
            <button type="submit" class="btn btn-sm btn-outline-danger hover-lift">
              <i class="bi bi-trash-fill"></i>
              <span class="d-none d-sm-inline ms-1">Borrar</span>
            </button>
          </form>
        </div>
      </div>
    </div>`;
}

/** Escapa caracteres HTML para evitar XSS al insertar texto dinámico */
function escapeHTML(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================================
   FAVORITOS - Funciones de UI
   ============================================================ */

/** Actualiza el aspecto visual de TODOS los botones ★ según LocalStorage */
function actualizarBotonesFav() {
  const favoritos = getFavoritos();
  document.querySelectorAll('.btn-fav').forEach(btn => {
    const id = parseInt(btn.dataset.id);
    const card = btn.closest('.juego-card');
    if (favoritos.includes(id)) {
      btn.classList.add('favorito');
      btn.title = 'Quitar de favoritos';
      card && card.classList.add('es-favorito');
    } else {
      btn.classList.remove('favorito');
      btn.title = 'Añadir a favoritos';
      card && card.classList.remove('es-favorito');
    }
  });
}

/**
 * Aplica la vista actual al grid:
 *  - 'todos': muestra todas las tarjetas
 *  - 'favoritos': muestra solo las tarjetas cuyos IDs están en favoritos
 */
function aplicarVista(vista) {
  vistaActual = vista;
  const favoritos = getFavoritos();
  const cards = document.querySelectorAll('.juego-card');
  const panelFiltros = document.getElementById('panel-filtros');
  const msgSinFav = document.getElementById('msg-sin-favoritos');
  const msgSinJuegos = document.getElementById('msg-sin-juegos');
  const tituloVista = document.getElementById('titulo-vista');
  const navTodos = document.getElementById('nav-todos');
  const navFavoritos = document.getElementById('nav-favoritos');
  const counter = document.getElementById('total-juegos');
  const statsDiv = document.getElementById('stats-juegos');

  if (vista === 'todos') {
    // Mostrar todas
    panelFiltros && (panelFiltros.style.display = '');
    msgSinFav && (msgSinFav.style.display = 'none');
    cards.forEach(c => c.classList.remove('oculto'));

    if (tituloVista) tituloVista.innerHTML = '🎮 Mi Colección de Videojuegos';
    if (navTodos) { navTodos.classList.add('active'); }
    if (navFavoritos) { navFavoritos.classList.remove('active'); }

    // Actualizar contador
    const visibles = document.querySelectorAll('.juego-card:not(.oculto)').length;
    if (counter) counter.textContent = visibles;
    if (statsDiv) statsDiv.style.display = visibles > 0 ? '' : 'none';

    // Ocultar o mostrar mensaje vacío original
    if (msgSinJuegos) msgSinJuegos.style.display = cards.length === 0 ? '' : 'none';

  } else {
    // Vista favoritos
    panelFiltros && (panelFiltros.style.display = 'none');
    if (tituloVista) tituloVista.innerHTML = '⭐ Mis Favoritos';
    if (navTodos) { navTodos.classList.remove('active'); }
    if (navFavoritos) { navFavoritos.classList.add('active'); }

    let visibles = 0;
    cards.forEach(card => {
      const id = parseInt(card.dataset.id);
      if (favoritos.includes(id)) {
        card.classList.remove('oculto');
        visibles++;
      } else {
        card.classList.add('oculto');
      }
    });

    // Mostrar / ocultar mensaje "sin favoritos"
    if (msgSinFav) msgSinFav.style.display = visibles === 0 ? '' : 'none';
    if (msgSinJuegos) msgSinJuegos.style.display = 'none';

    if (counter) counter.textContent = visibles;
    if (statsDiv) statsDiv.style.display = visibles > 0 ? '' : 'none';
  }
}

/* ============================================================
   AJAX - Mostrar feedback genérico
   ============================================================ */

function mostrarFeedbackAjax(texto, tipo, duracion = 4000) {
  const div = document.getElementById('ajax-feedback');
  if (!div) return;
  div.textContent = texto;
  div.className = `alert alert-${tipo} visible`;
  div.style.removeProperty('display'); // quitar el !important inline
  div.style.display = 'block';
  if (duracion > 0) {
    setTimeout(() => {
      div.style.display = 'none';
      div.className = 'alert';
    }, duracion);
  }
}

/* ============================================================
   AJAX - Formulario de INSERCIÓN
   ============================================================ */

function inicializarFormInsertar() {
  const form = document.getElementById('form-insertar');
  if (!form) return;

  const msgDiv = document.getElementById('form-insertar-msg');
  const btnGuardar = document.getElementById('btn-guardar-insertar');
  const grid = document.getElementById('grid-juegos');
  const msgSinJuegos = document.getElementById('msg-sin-juegos');
  const counter = document.getElementById('total-juegos');
  const statsDiv = document.getElementById('stats-juegos');

  function mostrarMensajeForm(texto, tipo) {
    if (!msgDiv) return;
    msgDiv.textContent = texto;
    msgDiv.className = `alert alert-${tipo}`;
    msgDiv.style.display = 'block';
    if (tipo === 'success') {
      setTimeout(() => { msgDiv.style.display = 'none'; }, 3000);
    }
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const titulo = form.querySelector('#ins-titulo').value.trim();
    const plataforma = form.querySelector('#ins-plataforma').value;
    const estado = form.querySelector('#ins-estado').value;

    if (!titulo) {
      mostrarMensajeForm('El título es obligatorio.', 'danger');
      return;
    }
    if (!plataforma) {
      mostrarMensajeForm('Selecciona una plataforma.', 'danger');
      return;
    }

    btnGuardar.disabled = true;
    btnGuardar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';

    const datos = new FormData(form);
    const body = new URLSearchParams(datos);

    try {
      const respuesta = await fetch('/videojuegos/insertar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: body.toString()
      });

      const json = await respuesta.json();

      if (!respuesta.ok) {
        mostrarMensajeForm(json.error || 'Error al guardar el juego.', 'danger');
      } else {
        // Éxito: añadir la nueva tarjeta al DOM
        const htmlTarjeta = generarTarjetaHTML(json.juego);
        if (msgSinJuegos) msgSinJuegos.style.display = 'none';
        grid.insertAdjacentHTML('beforeend', htmlTarjeta);

        // Actualizar contador
        const totalActual = document.querySelectorAll('.juego-card').length;
        if (counter) { counter.textContent = totalActual; }
        if (statsDiv) { statsDiv.style.display = ''; }

        // La delegación de eventos funciona automáticamente en la nueva tarjeta
        const nuevaCard = grid.querySelector(`.juego-card[data-id="${json.juego.id}"]`);
        actualizarBotonesFav();

        // Resetear el formulario y mostrar confirmación
        form.reset();
        mostrarMensajeForm('✅ Juego añadido correctamente.', 'success');

        // Si estamos en vista favoritos, ocultar la nueva tarjeta
        if (vistaActual === 'favoritos') {
          nuevaCard && nuevaCard.classList.add('oculto');
        }
      }
    } catch (err) {
      mostrarMensajeForm('Error de conexión. Inténtalo de nuevo.', 'danger');
    } finally {
      btnGuardar.disabled = false;
      btnGuardar.innerHTML = '<i class="bi bi-check-lg me-1"></i>Guardar';
    }
  });
}

/* ============================================================
   DELEGACIÓN DE EVENTOS — Favoritos y Eliminación
   Se registran UNA SOLA VEZ en el document y funcionan
   para tarjetas existentes y las añadidas vía AJAX.
   ============================================================ */

function inicializarDelegacion() {

  // --- Botón ★ favorito (click en .btn-fav) ---
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-fav');
    if (!btn) return;

    e.stopPropagation();
    const id = parseInt(btn.dataset.id);
    const esFav = toggleFavorito(id);
    actualizarBotonesFav();

    const card = btn.closest('.juego-card');

    // Si estamos en vista favoritos y se ha desmarcado, ocultar la tarjeta
    if (vistaActual === 'favoritos' && !esFav) {
      if (card) card.classList.add('oculto');
      const visibles = document.querySelectorAll('.juego-card:not(.oculto)').length;
      const msgSinFav = document.getElementById('msg-sin-favoritos');
      const counter = document.getElementById('total-juegos');
      const statsDiv = document.getElementById('stats-juegos');
      if (msgSinFav) msgSinFav.style.display = visibles === 0 ? '' : 'none';
      if (counter) counter.textContent = visibles;
      if (statsDiv) statsDiv.style.display = visibles > 0 ? '' : 'none';
    }

    mostrarFeedbackAjax(
      esFav ? '⭐ Añadido a favoritos' : '🗑️ Eliminado de favoritos',
      esFav ? 'success' : 'warning',
      2000
    );
  });

  // --- Formulario eliminar (submit en .form-eliminar) ---
  document.addEventListener('submit', function(e) {
    if (!e.target.classList.contains('form-eliminar')) return;

    const form = e.target;
    const id = parseInt(form.querySelector('input[name="id"]').value);
    // Leer el título del atributo data-titulo (puesto en el EJS) o del DOM
    const titulo = form.dataset.titulo ||
                   form.closest('.card')?.querySelector('.card-title')?.textContent?.trim() ||
                   'este juego';

    if (!confirm('¿Seguro que quieres eliminar "' + titulo + '"?')) {
      e.preventDefault();
    } else {
      // Limpiar de favoritos si estaba guardado
      const favs = getFavoritos().filter(function(f) { return f !== id; });
      setFavoritos(favs);
    }
  });
}

/* ============================================================
   INICIALIZACIÓN AL CARGAR EL DOCUMENTO
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* --- 1. Logout con confirmación --- */
  const btnLogout = document.querySelector('a[href="/logout"]');
  if (btnLogout) {
    btnLogout.addEventListener('click', function(e) {
      if (!confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        e.preventDefault();
      }
    });
  }

  /* --- 2. ¿Estamos en el panel /admin? Si no hay grid salimos --- */
  const grid = document.getElementById('grid-juegos');
  if (!grid) return; // No es la vista del panel, salir

  /* --- 3. Delegación de eventos para favoritos y eliminación --- */
  inicializarDelegacion();

  /* --- 4. Aplicar estado de favoritos visual --- */
  actualizarBotonesFav();

  /* --- 5. Determinar vista inicial:
        - Si hay favoritos en LocalStorage → mostrar vista favoritos
        - Si no hay favoritos → mostrar todos
  --- */
  const favoritosGuardados = getFavoritos();
  const hayTarjetas = document.querySelectorAll('.juego-card').length > 0;

  if (favoritosGuardados.length > 0 && hayTarjetas) {
    aplicarVista('favoritos');
  } else {
    aplicarVista('todos');
  }

  /* --- 6. Listeners del navbar: Todos / Favoritos --- */
  const navTodos = document.getElementById('nav-todos');
  const navFavoritos = document.getElementById('nav-favoritos');

  if (navTodos) {
    navTodos.addEventListener('click', function(e) {
      e.preventDefault();
      aplicarVista('todos');
    });
  }

  if (navFavoritos) {
    navFavoritos.addEventListener('click', function(e) {
      e.preventDefault();
      aplicarVista('favoritos');
    });
  }

  /* --- 7. Botón "Ver Todos los Juegos" desde el mensaje sin-favoritos --- */
  const btnVerTodos = document.getElementById('btn-ver-todos-desde-fav');
  if (btnVerTodos) {
    btnVerTodos.addEventListener('click', function() {
      aplicarVista('todos');
    });
  }

  /* --- 8. Inicializar formulario AJAX de inserción --- */
  inicializarFormInsertar();
});

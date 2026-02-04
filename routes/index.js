/**
 * Archivo de rutas principal de la aplicación
 */

var express = require('express');
var router = express.Router();
var path = require('path'); 

const Database = require('../data/database');
const UsuarioDAO = require('../data/usuario-dao');
const VideojuegoDAO = require('../data/videojuego-dao');
const authMiddleware = require('../middlewares/auth');

// Inicialización de la base de datos
const dbPath = path.join(__dirname, '../db.sqlite'); 
const db = Database.getInstance(dbPath);
const dao = new UsuarioDAO(db);
const daoVideojuegos = new VideojuegoDAO(db);

// Valores permitidos para validación
const PLATAFORMAS_VALIDAS = ['PC', 'PlayStation', 'Xbox', 'Nintendo'];
const ESTADOS_VALIDOS = ['Pendiente', 'Jugando', 'Terminado'];

/* RUTAS PÚBLICAS */

// Página de inicio
router.get('/', (req, res) => {
    res.render('index', { title: 'Game Collection' });
});

// Página de login
router.get('/login', (req, res) => {
    res.render('login', { error: null, title: 'Login' });
});

// Procesar inicio de sesión
router.post('/login', (req, res) => {
    const user = dao.findUserByEmail(req.body.name);
    
    if (user && user.password === req.body.password) {
        req.session.user = { id: user.id, email: user.email };
        res.redirect('/admin');
    } else {
        res.render('login', { error: "Credenciales incorrectas", title: 'Login' });
    }
});

/**
 * GET /logout - Cerrar sesión
 * Destruye la sesión del usuario y redirige a la página de inicio
 */
router.get('/logout', (req, res) => {
  // Destruir la sesión
  req.session.destroy();
  // Redirigir a la página de inicio
  res.redirect('/');
});

/* ============================================
   RUTAS PRIVADAS (requieren autenticación)
   ============================================ */

/**
 * GET /admin - Panel de administración de videojuegos (HU6)
 * 
 * Muestra la colección de videojuegos del usuario autenticado.
 * Permite filtrar por plataforma, género y estado.
 * 
 * Query params opcionales:
 * - plataforma: Filtrar por plataforma
 * - genero: Filtrar por género
 * - estado: Filtrar por estado
 */
router.get('/admin', authMiddleware, (req, res) => {
    // Recoger los filtros de la query string
    const filtros = {
        plataforma: req.query.plataforma || '',
        genero: req.query.genero || '',
        estado: req.query.estado || ''
    };

    // Obtener los videojuegos del usuario aplicando los filtros
    const juegos = daoVideojuegos.findAll(req.session.user.id, filtros);
    
    // Renderizar la vista con los datos
    res.render('admin', { 
      layout: 'layout-admin', 
      user: req.session.user, 
      videojuegos: juegos, 
      filtros: filtros,    
      title: 'Mi Colección'
    });
});

/**
 * POST /videojuegos/insertar - Crear nuevo videojuego (HU2)
 * 
 * Valida los datos y crea un nuevo videojuego en la colección del usuario.
 * 
 * Body params:
 * - titulo: Título del videojuego (obligatorio)
 * - plataforma: Plataforma (obligatorio, debe ser válida)
 * - genero: Género (opcional)
 * - estado: Estado (obligatorio, debe ser válido)
 */
router.post('/videojuegos/insertar', authMiddleware, (req, res) => {
    const { titulo, plataforma, genero, estado } = req.body;
    
    // VALIDACIÓN: Verificar que los campos obligatorios no estén vacíos
    if (!titulo || !titulo.trim()) {
        return res.status(400).send('El título es obligatorio');
    }
    
    if (!plataforma || !PLATAFORMAS_VALIDAS.includes(plataforma)) {
        return res.status(400).send('Plataforma no válida');
    }
    
    if (!estado || !ESTADOS_VALIDOS.includes(estado)) {
        return res.status(400).send('Estado no válido');
    }
    
    // Insertar el videojuego en la base de datos
    daoVideojuegos.insert(req.session.user.id, titulo.trim(), plataforma, genero || '', estado);
    
    // Redirigir de vuelta al panel de administración
    res.redirect('/admin');
});

/**
 * POST /videojuegos/eliminar - Eliminar videojuego (HU4)
 * 
 * Elimina un videojuego de la colección del usuario.
 * Verifica que el videojuego pertenezca al usuario antes de eliminarlo (seguridad).
 * 
 * Body params:
 * - id: ID del videojuego a eliminar
 */
router.post('/videojuegos/eliminar', authMiddleware, (req, res) => {
    const id = parseInt(req.body.id);
    
    // VALIDACIÓN: Verificar que el videojuego pertenece al usuario (HU1 - seguridad)
    if (!daoVideojuegos.belongsToUser(id, req.session.user.id)) {
        return res.status(403).send('No tienes permiso para eliminar este videojuego');
    }
    
    // Eliminar el videojuego
    daoVideojuegos.delete(id);
    
    // Redirigir de vuelta al panel de administración
    res.redirect('/admin');
});

/**
 * GET /videojuegos/editar/:id - Mostrar formulario de edición (HU3)
 * 
 * Muestra el formulario para editar un videojuego existente.
 * Verifica que el videojuego pertenezca al usuario antes de mostrar el formulario.
 * 
 * URL params:
 * - id: ID del videojuego a editar
 */
router.get('/videojuegos/editar/:id', authMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    
    // Buscar el videojuego por ID
    const juego = daoVideojuegos.findById(id);
    
    // Verificar que existe y pertenece al usuario (HU1 - seguridad)
    if (juego && juego.id_usuario === req.session.user.id) {
        // Mostrar el formulario de edición
        res.render('editar-videojuego', { 
            layout: 'layout-admin', 
            user: req.session.user,
            juego: juego,
            title: 'Editar Juego'
        });
    } else {
        // Si no existe o no pertenece al usuario, redirigir al panel
        res.redirect('/admin');
    }
});

/**
 * POST /videojuegos/actualizar - Guardar cambios de edición (HU3)
 * 
 * Actualiza los datos de un videojuego existente.
 * Valida los datos y verifica que el videojuego pertenezca al usuario.
 * 
 * Body params:
 * - id: ID del videojuego a actualizar
 * - titulo: Nuevo título (obligatorio)
 * - plataforma: Nueva plataforma (obligatorio, debe ser válida)
 * - genero: Nuevo género (opcional)
 * - estado: Nuevo estado (obligatorio, debe ser válido)
 */
router.post('/videojuegos/actualizar', authMiddleware, (req, res) => {
    const { id, titulo, plataforma, genero, estado } = req.body;
    const idNum = parseInt(id);
    
    // VALIDACIÓN: Verificar que el videojuego pertenece al usuario (HU1 - seguridad)
    if (!daoVideojuegos.belongsToUser(idNum, req.session.user.id)) {
        return res.status(403).send('No tienes permiso para editar este videojuego');
    }
    
    // VALIDACIÓN: Verificar que los campos obligatorios no estén vacíos
    if (!titulo || !titulo.trim()) {
        return res.status(400).send('El título es obligatorio');
    }
    
    if (!plataforma || !PLATAFORMAS_VALIDAS.includes(plataforma)) {
        return res.status(400).send('Plataforma no válida');
    }
    
    if (!estado || !ESTADOS_VALIDOS.includes(estado)) {
        return res.status(400).send('Estado no válido');
    }
    
    // Actualizar el videojuego en la base de datos
    daoVideojuegos.update(idNum, titulo.trim(), plataforma, genero || '', estado);
    
    // Redirigir de vuelta al panel de administración
    res.redirect('/admin');
});

module.exports = router;
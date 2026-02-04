/**
 * Archivo principal de configuración de la aplicación Express
 */

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var expressSession = require('express-session');

var indexRouter = require('./routes/index');

var app = express();

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesión para autenticación
app.use(expressSession({
  secret: 'mi-clave-secreta-supersegura',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// --- CONFIGURACIÓN DE RUTAS ---
// Todas las rutas definidas en routes/index.js se montan en la raíz '/'
app.use('/', indexRouter);

// --- MANEJO DE ERRORES ---

// Middleware para capturar peticiones a rutas no definidas (404)
app.use(function(req, res, next) {
  next(createError(404));
});

// Middleware de manejo de errores
// Este middleware se ejecuta cuando ocurre cualquier error en la aplicación
app.use(function(err, req, res, next) {
  // Hacer el mensaje de error disponible en la vista
  res.locals.message = err.message;
  // Mostrar el stack trace solo en desarrollo
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // Renderizar la página de error con el código de estado apropiado
  res.status(err.status || 500);
  res.render('error');
});

// Exportar la aplicación para que pueda ser usada por el servidor (bin/www)
module.exports = app;
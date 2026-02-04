/**
 * Middleware de autenticación
 * 
 * Este middleware protege las rutas privadas de la aplicación (HU1).
 * Verifica que el usuario tenga una sesión activa antes de permitir
 * el acceso a recursos protegidos.
 * 
 * Si el usuario está autenticado, permite continuar con la petición.
 * Si no está autenticado, redirige a la página de login.
 * 
 * Uso: Añadir como segundo parámetro en las rutas que requieren autenticación
 * Ejemplo: router.get('/admin', authMiddleware, (req, res) => {...})
 */
module.exports = (req, res, next) => {
  // Verificar si existe un usuario en la sesión
  if (req.session.user) {
    // Usuario autenticado: permitir acceso a la ruta
    next();
  } else {
    // Usuario no autenticado: redirigir al login
    res.redirect('/login');
  }
}
/**
 * Script de inicialización de la tabla 'usuarios'
 * 
 * Este módulo se ejecuta automáticamente al iniciar la aplicación (ver database.js).
 * Crea la tabla de usuarios si no existe y, si está vacía, inserta un usuario
 * administrador por defecto para poder acceder a la aplicación.
 */

/**
 * Función de inicialización que recibe la instancia de la base de datos
 * @param {Database} db - Instancia de la base de datos SQLite
 */
module.exports = (db) => {
    // 1. Crear la tabla de usuarios si no existe
    db.prepare(`
        CREATE TABLE IF NOT EXISTS usuarios (
            -- Identificador único del usuario (clave primaria, autoincremental)
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            
            -- Email del usuario (se usa como nombre de usuario para login)
            email VARCHAR(255) NOT NULL,
            
            -- Contraseña del usuario
            -- NOTA: En producción debería estar hasheada con bcrypt
            password VARCHAR(255) NOT NULL
        )
    `).run();

    // 2. Comprobar si la tabla está vacía
    const count = db.prepare('SELECT count(*) as total FROM usuarios').get();
    
    // 3. Si no hay usuarios, crear el usuario administrador por defecto
    // Esto permite acceder a la aplicación la primera vez que se ejecuta
    if(count.total === 0){
        console.log("--- CREANDO USUARIO ADMIN (Usuario: admin, Pass: admin) ---");
        db.prepare('INSERT INTO usuarios (email, password) VALUES (?, ?)').run('admin', 'admin');
    }
}
/**
 * Script de inicialización de la tabla 'videojuegos'
 * 
 * Este módulo se ejecuta automáticamente al iniciar la aplicación (ver database.js).
 * Crea la tabla de videojuegos si no existe, garantizando que la estructura
 * de la base de datos esté lista para su uso.
 */

/**
 * Función de inicialización que recibe la instancia de la base de datos
 * @param {Database} db - Instancia de la base de datos SQLite
 */
module.exports = (db) => {
    // Consulta SQL para crear la tabla videojuegos
    // Usa CREATE TABLE IF NOT EXISTS para evitar errores si ya existe
    const sql = `
        CREATE TABLE IF NOT EXISTS videojuegos (
            -- Identificador único del videojuego (clave primaria, autoincremental)
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            
            -- ID del usuario propietario (clave foránea a la tabla usuarios)
            -- NOT NULL garantiza que todo videojuego pertenezca a un usuario (HU1)
            id_usuario INTEGER NOT NULL,
            
            -- Título del videojuego (campo obligatorio)
            titulo TEXT NOT NULL,
            
            -- Plataforma donde se juega (PC, PlayStation, Xbox, Nintendo, etc.)
            plataforma TEXT NOT NULL,
            
            -- Género del videojuego (RPG, FPS, Aventura, Estrategia, etc.)
            -- Permite filtrado por género (HU6)
            genero TEXT,
            
            -- Estado del juego: Pendiente, Jugando o Terminado (HU5)
            -- Valor por defecto: 'Pendiente'
            estado TEXT DEFAULT 'Pendiente',
            
            -- URL o ruta de la imagen del videojuego (opcional, para futuras mejoras)
            imagen TEXT,
            
            -- Fecha de creación del registro (se establece automáticamente)
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
            
            -- Clave foránea que relaciona cada videojuego con su usuario propietario
            -- Garantiza la integridad referencial de la base de datos
            FOREIGN KEY(id_usuario) REFERENCES usuarios(id)
        )
    `;
    
    // Ejecutar la consulta de creación de tabla
    db.prepare(sql).run();
}
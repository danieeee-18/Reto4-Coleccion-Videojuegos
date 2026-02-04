/**
 * DAO (Data Access Object) para la gestión de videojuegos
 * 
 * Esta clase encapsula todas las operaciones de acceso a datos relacionadas
 * con la tabla 'videojuegos' en la base de datos SQLite.
 * Proporciona métodos para crear, leer, actualizar y eliminar videojuegos (CRUD),
 * así como funcionalidades de filtrado por plataforma, género y estado.
 */
class VideojuegoDAO {
    #database;
    
    /**
     * Constructor del DAO de videojuegos
     * @param {Database} database - Instancia de la base de datos SQLite
     */
    constructor(database) {
        this.#database = database;
    }

    /**
     * Obtiene todos los videojuegos de un usuario con filtros opcionales (HU6)
     * 
     * Construye dinámicamente la consulta SQL según los filtros proporcionados.
     * Permite filtrar por plataforma, género y/o estado de forma combinada.
     * 
     * @param {number} userId - ID del usuario propietario de los videojuegos
     * @param {Object} filtro - Objeto con los filtros a aplicar
     * @param {string} [filtro.plataforma] - Filtro por plataforma (PC, PlayStation, Xbox, Nintendo)
     * @param {string} [filtro.genero] - Filtro por género (RPG, FPS, Aventura, etc.)
     * @param {string} [filtro.estado] - Filtro por estado (Pendiente, Jugando, Terminado)
     * @returns {Array} Array de objetos con los videojuegos que cumplen los criterios
     */
    findAll(userId, filtro = {}) {
        // Consulta base: siempre filtramos por usuario para garantizar privacidad (HU1)
        let sql = "SELECT * FROM videojuegos WHERE id_usuario = ?";
        const params = [userId];

        // Añadir filtro por plataforma si está presente
        if (filtro.plataforma && filtro.plataforma !== '') {
            sql += " AND plataforma = ?";
            params.push(filtro.plataforma);
        }
        
        // Añadir filtro por género si está presente (HU6 - completado)
        if (filtro.genero && filtro.genero !== '') {
            sql += " AND genero = ?";
            params.push(filtro.genero);
        }
        
        // Añadir filtro por estado si está presente (HU5)
        if (filtro.estado && filtro.estado !== '') {
            sql += " AND estado = ?";
            params.push(filtro.estado);
        }

        // Ejecutar consulta con todos los parámetros
        return this.#database.prepare(sql).all(...params);
    }

    /**
     * Busca un videojuego específico por su ID (HU3)
     * 
     * @param {number} id - ID del videojuego a buscar
     * @returns {Object|undefined} Objeto con los datos del videojuego o undefined si no existe
     */
    findById(id) {
        return this.#database.prepare("SELECT * FROM videojuegos WHERE id = ?").get(id);
    }

    /**
     * Verifica si un videojuego pertenece a un usuario específico
     * 
     * Esta validación es crítica para la seguridad (HU1) - evita que un usuario
     * pueda editar o eliminar videojuegos de otros usuarios.
     * 
     * @param {number} id - ID del videojuego
     * @param {number} userId - ID del usuario
     * @returns {boolean} true si el videojuego pertenece al usuario, false en caso contrario
     */
    belongsToUser(id, userId) {
        const juego = this.findById(id);
        return juego && juego.id_usuario === userId;
    }

    /**
     * Crea un nuevo videojuego en la colección del usuario (HU2)
     * 
     * @param {number} userId - ID del usuario propietario
     * @param {string} titulo - Título del videojuego
     * @param {string} plataforma - Plataforma (PC, PlayStation, Xbox, Nintendo)
     * @param {string} genero - Género del juego (RPG, FPS, Aventura, etc.)
     * @param {string} estado - Estado del juego (Pendiente, Jugando, Terminado)
     * @returns {Object} Resultado de la inserción con información sobre la operación
     */
    insert(userId, titulo, plataforma, genero, estado) {
        const sql = `INSERT INTO videojuegos (id_usuario, titulo, plataforma, genero, estado) 
                     VALUES (?, ?, ?, ?, ?)`;
        return this.#database.prepare(sql).run(userId, titulo, plataforma, genero, estado);
    }

    /**
     * Actualiza la información de un videojuego existente (HU3)
     * 
     * IMPORTANTE: Antes de llamar a este método, se debe verificar que el videojuego
     * pertenece al usuario usando belongsToUser() para garantizar seguridad.
     * 
     * @param {number} id - ID del videojuego a actualizar
     * @param {string} titulo - Nuevo título
     * @param {string} plataforma - Nueva plataforma
     * @param {string} genero - Nuevo género
     * @param {string} estado - Nuevo estado
     * @returns {Object} Resultado de la actualización
     */
    update(id, titulo, plataforma, genero, estado) {
        const sql = `UPDATE videojuegos 
                     SET titulo = ?, plataforma = ?, genero = ?, estado = ? 
                     WHERE id = ?`;
        return this.#database.prepare(sql).run(titulo, plataforma, genero, estado, id);
    }

    /**
     * Elimina un videojuego de la colección (HU4)
     * 
     * IMPORTANTE: Antes de llamar a este método, se debe verificar que el videojuego
     * pertenece al usuario usando belongsToUser() para garantizar seguridad.
     * 
     * @param {number} id - ID del videojuego a eliminar
     * @returns {Object} Resultado de la eliminación
     */
    delete(id) {
        return this.#database.prepare("DELETE FROM videojuegos WHERE id = ?").run(id);
    }
}

module.exports = VideojuegoDAO;
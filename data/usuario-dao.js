/**
 * DAO (Data Access Object) para la gestión de usuarios
 * 
 * Esta clase encapsula las operaciones de acceso a datos relacionadas
 * con la tabla 'usuarios' en la base de datos SQLite.
 * Proporciona métodos para la autenticación y gestión de usuarios.
 */
class UsuarioDAO {
    #database;
    
    /**
     * Constructor del DAO de usuarios
     * @param {Database} database - Instancia de la base de datos SQLite
     */
    constructor(database) {
        this.#database = database;
    }

    /**
     * Busca un usuario por su email
     * 
     * Este método se utiliza principalmente en el proceso de autenticación (HU1).
     * Retorna toda la información del usuario incluyendo la contraseña para
     * poder verificarla durante el login.
     * 
     * @param {string} email - Email del usuario a buscar
     * @returns {Object|undefined} Objeto con los datos del usuario (id, email, password) o undefined si no existe
     */
    findUserByEmail(email){
        // Busca un usuario que coincida con el email recibido
        const sql = "SELECT * FROM usuarios WHERE email = ?";
        return this.#database.prepare(sql).get(email);
    }
}

module.exports = UsuarioDAO;
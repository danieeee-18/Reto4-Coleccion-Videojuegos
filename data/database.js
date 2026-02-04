/**
 * Clase Database - Implementación del patrón Singleton
 * 
 * Esta clase gestiona la conexión única a la base de datos SQLite.
 * Utiliza el patrón Singleton para garantizar que solo exista una instancia
 * de la conexión a la base de datos en toda la aplicación, evitando
 * múltiples conexiones innecesarias y problemas de concurrencia.
 */
class Database {
  // Variable privada estática que almacena la única instancia de la base de datos
  static #db = null;

  /**
   * Constructor privado - no se puede instanciar directamente
   * Lanza un error si se intenta usar 'new Database()'
   */
  constructor() {
    throw new Error("Usa Database.getInstance()");
  }

  /**
   * Método estático para obtener la instancia única de la base de datos
   * 
   * Si es la primera vez que se llama, crea la conexión y ejecuta los scripts
   * de inicialización de tablas. En llamadas posteriores, devuelve la instancia existente.
   * 
   * @param {string} dbPath - Ruta al archivo de base de datos SQLite (requerido solo en la primera llamada)
   * @returns {Database} Instancia única de la base de datos
   * @throws {Error} Si no se proporciona dbPath en la primera inicialización
   */
  static getInstance(dbPath) {
      if (!dbPath) {
        throw new Error("dbPath es requerido para la primera inicialización");
      } else {
        // Importar la librería better-sqlite3 para gestionar SQLite
        const BetterSqlite3 = require("better-sqlite3");
        // Crear la conexión a la base de datos
        Database.#db = new BetterSqlite3(dbPath);
        
        // --- INICIALIZACIÓN DE TABLAS ---
        // Ejecutar scripts que crean las tablas si no existen (CREATE TABLE IF NOT EXISTS)
        // IMPORTANTE: El orden importa - primero videojuegos, luego usuarios (por las FK)
        require("./initialize-videojuegos")(Database.#db);
        require("./initialize-usuarios")(Database.#db);
      }
    // Retornar la instancia única
    return Database.#db;
  }

  /**
   * Método estático para preparar consultas SQL
   * 
   * Wrapper conveniente para acceder al método prepare() de better-sqlite3
   * sin necesidad de llamar a getInstance() cada vez.
   * 
   * @param {string} sql - Consulta SQL a preparar
   * @returns {Statement} Objeto Statement de better-sqlite3 listo para ejecutar
   */
  static prepare(sql) {
    return Database.#db.prepare(sql);
  }
}

module.exports = Database;
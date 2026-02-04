# 🎮 Game Collection

> Aplicación web completa para la gestión de colecciones personales de videojuegos

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.22-blue.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-lightgrey.svg)](https://www.sqlite.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)](https://getbootstrap.com/)

## 📋 Descripción

Game Collection es una aplicación web moderna y responsive que permite a los usuarios gestionar su colección personal de videojuegos de forma sencilla e intuitiva. Desarrollada con Node.js, Express y SQLite, ofrece una interfaz atractiva basada en Bootstrap con un diseño personalizado que incluye gradientes modernos, glassmorphism y animaciones suaves.

### ✨ Características Principales

- 🔐 **Autenticación segura** - Sistema de login con sesiones
- ➕ **CRUD completo** - Crear, leer, actualizar y eliminar videojuegos
- 🎯 **Filtrado avanzado** - Filtra por plataforma, género y estado
- 📊 **Gestión de estado** - Marca juegos como Pendiente, Jugando o Terminado
- 🎨 **Diseño moderno** - Interfaz atractiva con gradientes y animaciones
- 📱 **Totalmente responsive** - Funciona perfectamente en móviles, tablets y ordenadores
- 🔒 **Privacidad garantizada** - Cada usuario solo ve su propia colección

## 🛠️ Tecnologías Utilizadas

### Backend

- **Node.js** - Entorno de ejecución de JavaScript
- **Express** - Framework web minimalista y flexible
- **SQLite** - Base de datos ligera y eficiente
- **better-sqlite3** - Driver síncrono para SQLite
- **express-session** - Gestión de sesiones de usuario
- **EJS** - Motor de plantillas para renderizado del lado del servidor

### Frontend

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS y gradientes
- **JavaScript** - Interactividad y validación
- **Bootstrap 5.3** - Framework CSS responsive
- **Bootstrap Icons** - Iconografía moderna

## 📦 Instalación

### Requisitos Previos

- Node.js 18 o superior
- npm (incluido con Node.js)

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/danieeee-18/Retro.git
   cd Retro
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Iniciar la aplicación**

   ```bash
   npm start
   ```

4. **Acceder a la aplicación**

   Abre tu navegador y visita: `http://localhost:3000`

## 🚀 Uso

### Credenciales por Defecto

Al iniciar la aplicación por primera vez, se crea automáticamente un usuario administrador:

- **Usuario:** `admin`
- **Contraseña:** `admin`

### Funcionalidades

#### 1. Iniciar Sesión

- Accede a `/login` o haz clic en "Iniciar Sesión" desde la página principal
- Introduce las credenciales por defecto
- Serás redirigido al panel de administración

#### 2. Añadir Videojuegos

- Haz clic en el botón "Nuevo Juego"
- Rellena el formulario con:
  - **Título** (obligatorio)
  - **Plataforma** (obligatorio): PC, PlayStation, Xbox o Nintendo
  - **Género** (opcional): RPG, FPS, Aventura, etc.
  - **Estado** (obligatorio): Pendiente, Jugando o Terminado
- Haz clic en "Guardar"

#### 3. Filtrar Videojuegos

- Utiliza los filtros en la parte superior del panel
- Puedes filtrar por:
  - **Plataforma**
  - **Género**
  - **Estado**
- Los filtros se pueden combinar
- Haz clic en "Limpiar" para resetear los filtros

#### 4. Editar Videojuegos

- Haz clic en el botón "Editar" de cualquier juego
- Modifica los campos deseados
- Haz clic en "Guardar Cambios"

#### 5. Eliminar Videojuegos

- Haz clic en el botón "Borrar" de cualquier juego
- Confirma la eliminación en el diálogo

## 📁 Estructura del Proyecto

```
Retro/
├── app.js                      # Configuración principal de Express
├── package.json                # Dependencias y scripts
├── db.sqlite                   # Base de datos SQLite (se crea automáticamente)
├── bin/
│   └── www                     # Script de inicio del servidor
├── data/                       # Capa de acceso a datos
│   ├── database.js             # Gestión de la conexión a BD (Singleton)
│   ├── usuario-dao.js          # DAO para usuarios
│   ├── videojuego-dao.js       # DAO para videojuegos
│   ├── initialize-usuarios.js  # Script de inicialización de tabla usuarios
│   └── initialize-videojuegos.js # Script de inicialización de tabla videojuegos
├── middlewares/                # Middlewares personalizados
│   └── auth.js                 # Middleware de autenticación
├── routes/                     # Definición de rutas
│   └── index.js                # Rutas principales de la aplicación
├── views/                      # Plantillas EJS
│   ├── layout.ejs              # Layout para páginas públicas
│   ├── layout-admin.ejs        # Layout para páginas privadas
│   ├── index.ejs               # Página de inicio (landing page)
│   ├── login.ejs               # Página de login
│   ├── admin.ejs               # Panel de administración
│   ├── editar-videojuego.ejs   # Formulario de edición
│   └── error.ejs               # Página de error
└── public/                     # Archivos estáticos
    └── stylesheets/
        └── style.css           # Estilos personalizados
```

## 🎯 Historias de Usuario Implementadas

### HU1: Control de Acceso ✅

Como usuario, quiero que la gestión de mi colección de videojuegos sea privada y no pueda ser accedida por nadie que no sea yo.

**Implementación:**

- Sistema de autenticación con sesiones
- Middleware de protección de rutas privadas
- Validación de pertenencia de videojuegos al usuario

### HU2: Alta de Videojuegos ✅

Como usuario autenticado, quiero añadir un nuevo videojuego indicando su título, plataforma, género y estado para llevar un control de mi colección.

**Implementación:**

- Formulario de creación con validación
- Campos: título, plataforma, género, estado
- Guardado automático de fecha de creación

### HU3: Edición de Videojuegos ✅

Como usuario, quiero poder editar la información de un videojuego ya registrado para mantener mis datos actualizados.

**Implementación:**

- Formulario de edición pre-rellenado
- Validación de pertenencia antes de editar
- Confirmación de cambios

### HU4: Eliminación de Videojuegos ✅

Como usuario, quiero eliminar videojuegos de mi colección para quitar aquellos que ya no deseo conservar.

**Implementación:**

- Botón de eliminación con confirmación
- Validación de pertenencia antes de eliminar
- Feedback visual

### HU5: Gestión del Estado ✅

Como usuario, quiero marcar un videojuego como completado o en progreso para saber cuáles ya he terminado.

**Implementación:**

- Estados: Pendiente, Jugando, Terminado
- Badges visuales con colores distintivos
- Filtrado por estado

### HU6: Filtrado y Consulta ✅

Como usuario, quiero filtrar mis videojuegos por plataforma, género o estado para localizar fácilmente los que me interesan.

**Implementación:**

- Filtros combinables por plataforma, género y estado
- Actualización dinámica de resultados
- Opción de limpiar filtros

## 🗄️ Esquema de Base de Datos

### Tabla: `usuarios`

| Campo    | Tipo         | Descripción              |
| -------- | ------------ | ------------------------ |
| id       | INTEGER (PK) | Identificador único      |
| email    | VARCHAR(255) | Email/nombre de usuario  |
| password | VARCHAR(255) | Contraseña (texto plano) |

### Tabla: `videojuegos`

| Campo          | Tipo         | Descripción                          |
| -------------- | ------------ | ------------------------------------ |
| id             | INTEGER (PK) | Identificador único                  |
| id_usuario     | INTEGER (FK) | ID del usuario propietario           |
| titulo         | TEXT         | Título del videojuego                |
| plataforma     | TEXT         | Plataforma (PC, PlayStation, etc.)   |
| genero         | TEXT         | Género del juego                     |
| estado         | TEXT         | Estado (Pendiente/Jugando/Terminado) |
| imagen         | TEXT         | URL de imagen (futuro)               |
| fecha_creacion | DATETIME     | Fecha de creación del registro       |

## 🎨 Diseño y UX

### Sistema de Diseño

La aplicación utiliza un sistema de diseño moderno basado en:

- **Variables CSS** para colores, espaciados y transiciones
- **Gradientes vibrantes** para elementos destacados
- **Glassmorphism** para cards y modales
- **Animaciones suaves** para mejorar la experiencia
- **Responsive design** con breakpoints optimizados

### Paleta de Colores

- **Primary Gradient:** `#667eea → #764ba2`
- **Success Gradient:** `#4facfe → #00f2fe`
- **Dark Background:** `#1a1a2e`
- **Text Primary:** `#ffffff`
- **Text Secondary:** `#a8b2d1`

## 🔒 Seguridad

### Medidas Implementadas

- ✅ Autenticación basada en sesiones
- ✅ Validación de pertenencia de recursos al usuario
- ✅ Validación de datos en el backend
- ✅ Protección de rutas privadas con middleware
- ✅ Sanitización de entradas de usuario

### Mejoras Futuras

- ⏳ Hash de contraseñas con bcrypt
- ⏳ Variables de entorno para secretos
- ⏳ Rate limiting para prevenir ataques
- ⏳ HTTPS en producción

## 📱 Responsive Design

La aplicación está optimizada para:

- 📱 **Móviles** (320px - 767px)
- 📱 **Tablets** (768px - 1023px)
- 💻 **Desktop** (1024px+)

## 🚀 Despliegue

### Preparación para Producción

1. **Configurar variables de entorno**

   ```bash
   # Crear archivo .env
   SESSION_SECRET=tu-clave-secreta-muy-segura
   NODE_ENV=production
   PORT=3000
   ```

2. **Actualizar app.js para usar variables de entorno**
   ```javascript
   secret: process.env.SESSION_SECRET || "mi-clave-secreta-supersegura";
   ```

### Opciones de Despliegue

- **Render** - [render.com](https://render.com)
- **Railway** - [railway.app](https://railway.app)
- **Fly.io** - [fly.io](https://fly.io)
- **Heroku** - [heroku.com](https://heroku.com)

## 👨‍💻 Desarrollo

### Scripts Disponibles

```bash
# Iniciar el servidor
npm start

# Modo desarrollo (con nodemon)
npm run dev
```

### Buenas Prácticas Implementadas

- ✅ Código completamente comentado en español
- ✅ Arquitectura organizada (MVC adaptado)
- ✅ Separación de responsabilidades
- ✅ Nombres descriptivos de variables y funciones
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ Código DRY (Don't Repeat Yourself)

## 📝 Licencia

ISC

## 👤 Autor

Desarrollado con ❤️ para el proyecto de Interfaces Web

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, por favor abre un issue en el repositorio de GitHub.

---

**Game Collection** - Gestiona tu colección de videojuegos de forma fácil y organizada 🎮

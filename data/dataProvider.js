const fs = require('fs');
const path = require('path');

// Leemos el archivo JSON igual que lo hace el profesor en dataService.js
// Usamos path.join para evitar problemas con las rutas
const postsBlog = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'posts.json'), 'utf8')
);

// Función equivalente a findAllProductos()
function findAllPosts() {
    return postsBlog;
}

// Función equivalente a findProductoById(id)
function findPostById(id) {
    // El profesor usa filter y devuelve el elemento [0], o find.
    // Usaremos find que es más directo, igual que él busca por ID.
    return postsBlog.find(p => p.id == id);
}

// Función equivalente a obtener categorías (extra para tu blog)
function getCategories() {
    return [...new Set(postsBlog.map(post => post.category))];
}

module.exports = {
    findAllPosts,
    findPostById,
    getCategories
}
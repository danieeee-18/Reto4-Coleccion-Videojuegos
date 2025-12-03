var express = require('express');
var router = express.Router();
// Importamos nuestro proveedor de datos (equivalente a dataService)
var dataProvider = require('../data/dataProvider');

/* GET home page. */
// El profesor usa router.get('/', ...) y renderiza 'index' pasando los datos.
router.get('/', function(req, res, next) {
  // Usamos el nuevo nombre de la función
  const items = dataProvider.findAllPosts();
  const categories = dataProvider.getCategories();
  
  // Pasamos 'posts' (equivalente a 'productos' del profesor)
  res.render('index', { posts: items, categories: categories });
});

/* GET detalle del post */
// El profesor usa "/producto/:pid". Nosotros usaremos "/post/:id"
router.get('/post/:id', function(req, res, next) {
  const id = req.params.id;
  // Usamos el nuevo nombre de la función
  const item = dataProvider.findPostById(id);
  const categories = dataProvider.getCategories();

  if(item) {
    // Pasamos 'post' (equivalente a 'item' en el código del profesor)
    res.render('post', { post: item, categories: categories });
  } else {
    res.status(404).render('error', {message: "Post no encontrado"});
  }
});

/* Filtrado por categoría */
router.get('/category/:name', function(req, res, next) {
    const catName = req.params.name;
    const allPosts = dataProvider.findAllPosts();
    // Filtramos
    const filtered = allPosts.filter(p => p.category === catName);
    const categories = dataProvider.getCategories();
    
    res.render('index', { posts: filtered, categories: categories });
});

module.exports = router;
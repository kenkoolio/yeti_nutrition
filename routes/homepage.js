// homepage.js
// author: Sariah Bunnell
// Provides routes for homepage feature.
router.get('/', function(req, res, next){
  res.render('home', {layout: "homeMain"}) 
});

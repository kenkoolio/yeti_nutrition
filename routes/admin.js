// admin.js
// author: Huy (Ken) Nguyen <nguyehu6@oregonstate.edu>
// Provides routes for admin page.

module.exports = (function() {
  var express = require('express');
  var router = express.Router();

  function addNewIngredient(req, res, next) {
    let ingredient_name = req.body.ingredient_name.toLowerCase();
    let query = `INSERT INTO ingredients (ingredient_name) VALUES (?)`;
    let mysql = req.app.get('mysql');

    mysql.pool.query(query, ingredient_name, (err, results, fields) => {
      if (err) return next(err);

      return res.redirect('/admin');
    })
  }


  router.post('/add_ingredient', addNewIngredient);

  router.get('/', function(req, res){
    res.render('admin');
  })

  return router;
})();

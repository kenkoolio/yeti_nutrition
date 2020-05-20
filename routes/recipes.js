// recipes.js
// author: Sariah Bunnell
// Provides routes for recipes feature.

module.exports = (function() {
  var express = require('express');
  var router = express.Router();

  function require_signin (req, res, next) {
    if (!req.session.signedin) {
      res.redirect('/signin');
    } else {
      next();
    }
  };

  router.get('/', require_signin, function(req, res, next){
    let mysql = req.app.get('mysql');
    mysql.pool.query(`SELECT * FROM recipes`, (err, rows, result) => {
      if(err){
        next(err);
        return;
      }
      var storage = [];
      rows.forEach(element => {
        storage.push({
          recipeLink: '/recipes/' + element.recipe_id,
          img: "images/" + element.thumbnail_img,
          recipeName: element.recipe_name
        });
      });
      res.render('recipes', {
        title: 'All Our Easy-to-Prepare Recipes',
        username: "Jackie Chan",
        getRecipe: storage
      });
    });
  });

  //app.get('/recipes',function(req, res){
    //res.render('mainRecipes');
  //});

  router.get('/:recipe_id', require_signin, function(req, res, next){
    let mysql = req.app.get('mysql');
    let query = `SELECT * FROM recipes INNER JOIN recipe_details ON recipes.recipe_id = recipe_details.recipe_id
    INNER JOIN ingredients ON ingredients.ingredient_id = recipe_details.ingredient_id
    WHERE recipes.recipe_id = ?`;
    mysql.pool.query(query, req.params.recipe_id, (err, rows, result)=> {
        if(err){
          next(err);
          return;
        }
        res.render('oneRecipe', {
          title: "Delicious Recipe",
          username: "Jackie Chan",
          recipeName: rows[0].recipe_name,
          img: "images/" + rows[0].recipe_img,
          recipeInstructions: rows[0].instructions,
          ingredient: rows,
          recipeSource: "Rocco Dispirito, Katie Caldesi, Giada de Laurentiis, Emeril Lagasse, Jamie Oliver and Alan Rosen & Beth Allen",
          calories: rows[0].total_calories
        });
    });
  });


  router.post('/:recipe_id', (req, res, next) => {
    let mysql = req.app.get('mysql');
    var context = {};
    let query = `SELECT * FROM recipes WHERE recipes.recipe_id = ?`;
    mysql.pool.query(query, req.params.recipe_id, (err, rows, result) => {
      if(err){
        next(err);
        return;
      }
      var storage = [];
      storage.push({"recipe_id": recipe_id, "recipe_name": recipe_name})
      context.results = storage;
      res.json(context);
    });
  });

  return router;
})();

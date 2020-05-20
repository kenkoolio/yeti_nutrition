// admin.js
// author: Huy (Ken) Nguyen <nguyehu6@oregonstate.edu>
// Provides routes for admin page.

module.exports = (function() {
  var express = require('express');
  var router = express.Router();

  function getAdminIndex(req, res, next) {
    let context = {title: 'Admin Home'};
    let mysql = req.app.get('mysql');
    // gets all ingredients for the admin page to add new recipes,
    // and allow navigation to edit/delete of ingredients
    let ing_query = `SELECT * FROM ingredients`;
    // gets all recipes for the admin page to allow naviagtion to edit/delete of recipe
    let recipe_query = `SELECT recipe_id, recipe_name, recipe_img, total_calories FROM recipes`;

    new Promise((resolve, reject) => {
      // get ingredients
      mysql.pool.query(ing_query, (err, results, fields) => {
        if (err) return reject(err);

        // success
        context.ingredients = results;
        resolve();
      })
    })
    .then(() => {
      // get recipes
      return new Promise((resolve, reject) => {
        mysql.pool.query(recipe_query, (err, results, fields) => {
          if (err) return reject(err);

          // success
          context.recipes = results;
          resolve();
        })
      })
    })
    .then(() => {
      // success, load page
      res.render('admin', context);
    })
    .catch((reason) => {
      // catch error
      return next(reason);
    })

  }

  function addNewIngredient(req, res, next) {
    let ingredient_name = req.body.ingredient_name.toLowerCase();
    let mysql = req.app.get('mysql');
    let check_query = `SELECT * FROM ingredients WHERE ingredient_name = ?`;
    let insert_query = `INSERT INTO ingredients (ingredient_name) VALUES (?)`;

    new Promise((resolve, reject) => {
      // check if ingredient already in database
      mysql.pool.query(check_query, ingredient_name, (err, results, fields) => {
        if (err) return next(err);

        if (results.length) {
          // already in database
          reject("That item is already in the database");
        } else {
          // not in database yet
          resolve();
        }
      })
    })
    .then(() => {
      // insert new ingredient
      return new Promise((resolve, reject) => {
        mysql.pool.query(insert_query, ingredient_name, (err, results, fields) => {
          if (err) return next(err);

          resolve();
        })
      })
    })
    .then(() => {
      // return success
      return res.json('Success');
    })
    .catch((reason) => {
      // return error message
      return res.status(400).json(reason);
    })
  }

  function addNewRecipe(req, res, next) {
    let recipe_name = req.body.recipe_name;
    let image_url = req.body.img_url;
    let calories = req.body.calories;
    let instructions = req.body.instructions;
    let ingredients = req.body.ingredients;

    let mysql = req.app.get('mysql');
    let check_query = `SELECT * FROM recipes WHERE recipe_name = ?`;
    let new_recipe_query = `INSERT INTO recipes (recipe_name, recipe_img, total_calories, instructions) VALUES (?, ?, ?, ?)`;
    if (!image_url) {
      new_recipe_query = `INSERT INTO recipes (recipe_name, total_calories, instructions) VALUES (?, ?, ?)`;
    }
    let new_recipe_details_query = `INSERT INTO recipe_details (recipe_id, ingredient_id, quantity, metric) VALUES ?`; // will have multiple entries
    let delete_recipe_query = `DELETE FROM recipes WHERE recipe_id = ?`;
    let delete_recipe_details_query = `DELETE FROM recipe_details WHERE recipe_id = ?`;

    // begin database inserts
    new Promise((resolve, reject) => {
      // check if recipe already in database
      mysql.pool.query(check_query, recipe_name, (err, results, fields) => {
        if (err) return next(err);

        if (results.length) {
          // already in database
          reject("That recipe is already in the database");
        } else {
          // not in database yet
          resolve();
        }
      })
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        // check if optional "recipe_img" was included
        let recipe_data = [recipe_name, image_url, calories, instructions];
        if (!image_url) {
          recipe_data = [recipe_name, calories, instructions];
        }

        // insert new recipe into database
        mysql.pool.query(new_recipe_query, recipe_data, (err, results, fields) => {
          if (err) return next(err);

          // successful creation, next step is to insert ingredients
          resolve(results.insertId);
        })
      })
    })
    .then((recipe_id) => {
      return new Promise((resolve, reject) => {
        // insert recipe_details (ingredients that go with recipes) into database

        // array for all ingredients
        let recipe_details = [];
        ingredients.forEach((ingredient) => {
          // put this ingredients info into an array
          let ingredient_row = [recipe_id];
          ingredient_row.push(ingredient.ingredient_id);
          ingredient_row.push(ingredient.quantity);
          ingredient_row.push(ingredient.metric);
          // insert this ingredient info array into the array of all ingredients
          recipe_details.push(ingredient_row);
        })

        // insert ingredients into recipe_details
        mysql.pool.query(new_recipe_details_query, [recipe_details], (err, results, fields) => {
          if (err) {
            // if error happened, backtrack and delete the new recipe and all new recipe_details
            // delete new recipe
            mysql.pool.query(delete_recipe_query, recipe_id, (err, results, fields) => {});
            // delete new recipe_details already made
            mysql.pool.query(delete_recipe_details_query, recipe_id, (err, results, fields) => {});

            return next(err);
          }

          // success
          resolve();
        })

      })
    })
    .then(() => {
      // return success
      return res.json('Success');
    })
    .catch((reason) => {
      // return error message
      return res.status(400).json(reason);
    })
  }

  function viewOneIngredient(req, res, next) {
    let mysql = req.app.get('mysql');
    let context = {}
    context.title = "Admin Edit Ingredient";

    let query = `SELECT * FROM ingredients WHERE ingredient_id = ?`;

    mysql.pool.query(query, req.params.id, (err, results, fields) => {
      if (err) return next(err);

      context.ingredient = results[0];
      res.render('admin_ingredient', context);
    })
  };

  function viewOneRecipe(req, res, next) {
    let mysql = req.app.get('mysql');
    let context = {};
    context.title = "Admin Edit Recipe";

    let recipe_query = `SELECT * FROM recipes WHERE recipe_id = ?`;
    let recipe_ingredients_query = `SELECT * FROM recipe_details JOIN ingredients ON ingredients.ingredient_id = recipe_details.ingredient_id WHERE recipe_details.recipe_id = ?`;
    let all_ingredients_query = `SELECT * FROM ingredients`;

    new Promise((resolve, reject) => {
      // get recipe info
      mysql.pool.query(recipe_query, req.params.id, (err, results, fields) => {
        if (err) return next(err);

        context.recipe = results[0];
        resolve();
      })
    })
    .then(() => {
      // get recipe's ingredient details
      return new Promise((resolve, reject) => {
        mysql.pool.query(recipe_ingredients_query, req.params.id, (err, results, fields) => {
          if (err) return next(err);

          context.recipe_ingredients = results;
          resolve();
        })
      })
    })
    .then(() => {
      // get all ingredients for user to choose from to make changes
      return new Promise((resolve, reject) => {
        mysql.pool.query(all_ingredients_query, (err, results, fields) => {
          if (err) return next(err);

          context.all_ingredients = results;
          resolve();
        })
      })
    })
    .then(() => {
      res.render('admin_recipe', context);
    })
    .catch((error) => {
      return next(error);
    })
  };

  function editOneIngredient(req, res, next) {
    let mysql = req.app.get('mysql');
    let ingredient_id = req.body.ingredient_id;
    let ingredient_name = req.body.ingredient_name;
    let check_query = `SELECT * FROM ingredients WHERE ingredient_name = ?`;
    let update_query = `UPDATE ingredients SET ingredient_name = ? WHERE ingredient_id = ?`;

    new Promise((resolve, reject) => {
      // check if ingredient already in database
      mysql.pool.query(check_query, [ingredient_name, ingredient_id] , (err, results, fields) => {
        if (err) return next(err);

        if (results.length) {
          // already in database
          reject("That item is already in the database");
        } else {
          // not in database yet
          resolve();
        }
      })
    })
    .then(() => {
      // edit ingredient name
      return new Promise((resolve, reject) => {
        mysql.pool.query(update_query, [ingredient_name, ingredient_id], (err, results, fields) => {
          if (err) return next(err);

          resolve();
        })
      })
    })
    .then(() => {
      // return success
      return res.json('Success');
    })
    .catch((reason) => {
      // return error message
      return res.status(400).json(reason);
    })
  }

  function deleteOneIngredient( req, res, next) {
    let mysql = req.app.get('mysql');
    let ingredient_id = req.body.ingredient_id;
    let delete_query = `DELETE FROM ingredients WHERE ingredient_id = ?`;

    new Promise((resolve, reject) => {
      mysql.pool.query(delete_query, ingredient_id, (err, results, fields) => {
        if (err) return next(err);

        resolve();
      })
    })
    .then(() => {
      // return success
      return res.json('Success');
    })
    .catch((reason) => {
      // return error message
      return res.status(400).json(reason);
    })
  }

  router.get('/', getAdminIndex);
  router.post('/add_ingredient', addNewIngredient);
  router.post('/add_recipe', addNewRecipe);
  router.get('/ingredients/actions/:id', viewOneIngredient);
  router.get('/recipes/actions/:id', viewOneRecipe);
  router.patch('/ingredients', editOneIngredient);
  router.delete('/ingredients', deleteOneIngredient);

  return router;
})();

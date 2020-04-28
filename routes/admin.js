// admin.js
// author: Huy (Ken) Nguyen <nguyehu6@oregonstate.edu>
// Provides routes for admin page.

module.exports = (function() {
  var express = require('express');
  var router = express.Router();

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


  router.post('/add_ingredient', addNewIngredient);

  router.get('/', function(req, res){
    res.render('admin');
  })

  return router;
})();

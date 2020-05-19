module.exports = (function() {
  var express = require('express');
  var router = express.Router();

//Sign in Page
  router.get('/', function(req, res){
    res.render('signup', {layout: false});
  })

//Create Session
  router.post('/create_user', function(req, res, next) {
  	var check_query = 'SELECT * FROM users WHERE user_name = ? OR email = ?';
  	var check_param = [req.body.username, req.body.email];
	var create_query = 'INSERT INTO users (first_name, last_name, email, user_name, password) VALUES (?, ?, ?, ?, ?)';
	var create_param = [req.body.firstname, req.body.lastname, req.body.email, req.body.username, req.body.password];
	var new_id_query = 'SELECT * FROM users WHERE user_name = ?';
	var new_id_param = [req.body.username];
	var mysql = req.app.get('mysql');

    new Promise((resolve, reject) => {
      // check if user already exists in database
      mysql.pool.query(check_query, check_param, (err, results, fields) => {
        if(results.length) {
          reject("User Already Exists!");
        }else{
          resolve();
        }
      })
    })
    .then(() => {
      // create new user
      return new Promise((resolve, reject) => {
        mysql.pool.query(create_query, create_param, (err, results, fields) => {
          if (err) return next(err);          
          resolve();
        })
      })
    })
    .then(() => {
      //create session for new user
      return new Promise((resolve, reject) => {
        mysql.pool.query(new_id_query, new_id_param, (err, results, fields) => {
          if (err) return next(err);
          req.session.signedin = true;
          req.session.active = true;
  		    req.session.username= req.body.username;
          req.session.user_id = results[0].user_id;          
          resolve();
        })
      })
    })
    .then(() => {
      // return success
      res.redirect('/posts'); //need to change to dashboard
    })
    .catch((reason) => {
      // return error message
      return res.status(400).json(reason);
    })
  });

  return router;
})();

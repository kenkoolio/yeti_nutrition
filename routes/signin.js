module.exports = (function() {
  var express = require('express');
  var router = express.Router();

//Sign in Page
  router.get('/', function(req, res){
    res.render('signin', {layout: false});
  })

//Create Session
  router.post('/validate', function(req, res, next) {
	var auth_query = 'SELECT * FROM users WHERE user_name = ? AND password = ?';
	var auth_param = [req.body.username, req.body.password];
	var mysql = req.app.get('mysql');
	mysql.pool.query(auth_query, auth_param, function(err, results, fields) {
		if (err) return next(err);
		if (results.length) {
			req.session.signedin = true;
			req.session.active = true;
			req.session.username= req.body.username;
			req.session.user_id = results[0].user_id;
			res.redirect('/dashboard');
		} else {
			res.redirect('/signin');
		}
		res.end();
	});
  });

  return router;
})();

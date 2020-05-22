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

router.get('/dashboard', require_signin, function(req, res, next){
  res.render('dashboard', {
    username: req.sessions.username,
  });
});
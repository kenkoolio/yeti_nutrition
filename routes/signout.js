module.exports = (function() {
  var express = require('express');
  var router = express.Router();

//Signout
  router.get('/', function(req, res){
    req.session.signedin = false;
    res.render('signout');
  })

  return router;
})();

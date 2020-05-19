module.exports = (function() {
  var express = require('express');
  var router = express.Router();

//Signout
  router.get('/', function(req, res){
    req.session.destroy();
    res.render('signout');
  })

  return router;
})();

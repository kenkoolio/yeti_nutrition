module.exports = (function() {
    var express = require('express');
    var router = express.Router();



router.get('/', function(req, res, next) {
    res.status(301).redirect("https://www.allrecipes.com/recipes/1232/healthy-recipes/low-calorie/")
});

    

return router;
})();
module.exports = (function() {
    var express = require('express');
    var router = express.Router();



router.get('/', function(req, res, next) {
    const CALORIC_LIMIT = 2000;
    var recipe_param = CALORIC_LIMIT;
    var user_total = 0;
    var total_query = 'SELECT sum(calorie_in) AS total_calorie FROM calories WHERE calorie_date = curdate() AND user_id = ?';
    var total_param = [req.session.user_id];
    var recipe_query = 'SELECT * FROM recipes WHERE total_calories <= ?';
    var mysql = req.app.get('mysql');
    var context = {};

    new Promise((resolve, reject) => {
        // check if user already exists in database
        mysql.pool.query(total_query, total_param, function(err, results) {
            if (err) return next(err);  
            if (results[0].total_calorie != null){
                user_total = results[0].total_calorie;
                recipe_param = [CALORIC_LIMIT - user_total];
            }
            resolve();
        })
    }).then(() => {
    // create new user
        return new Promise((resolve, reject) => {

            console.log(recipe_param);
            mysql.pool.query(recipe_query, recipe_param, (err, results) => {
                if (err) return next(err);
                var storage = [];
                console.log(results.length);
                if(results.length){
                    for (var i = 0; i < results.length; i++){
                        console.log(results[i].recipe_name);
                        //**************************************************************//
                        storage.push({
                                        "recipe_id": "recipes/" + results[i].recipe_id,
                                        "recipe_name": results[i].recipe_name,
                                        "recipe_img": results[i].recipe_img,
                                        "total_calories": results[i].total_calories
                                    });
                        //**************************************************************//
                    }
                    // context.results = storage; 
                    // res.json(context);
                }else{
                    storage.push({
                        "recipe_id": "https://www.allrecipes.com/recipes/1232/healthy-recipes/low-calorie/",
                        "recipe_name": "No Recipes Meeting Requirement",
                        "recipe_img": "yeti.jpg",
                        "total_calories": 0
                    });
                    // context.results = storage;
                    // res.json(context);
                }          
                // resolve();
                context.results = storage;
                    res.json(context);
            })
        })
    }).catch((reason) => {
        // return error message
        return res.status(400).json(reason);
    })
});

    

return router;
})();
/*Sources Cited: Instructor. Boilerplate Code. Week 7 Lectures. 
http://eecs.oregonstate.edu/ecampus-video/CS290/core-content/hello-node/hello-node.html*/

var express = require("express");               
var app = express();
var bodyParser = require("body-parser"); 
var handlebars = require("express-handlebars").create({defaultLayout: "mainRecipes"});
var mysql = require('mysql');

var pool = mysql.createPool({
   connectionLimit : 1000,
   connectTimeout  : 60 * 60 * 1000,
   acquireTimeout  : 60 * 60 * 1000,
   timeout: 60 * 60 * 1000,
   host: 'classmysql.engr.oregonstate.edu',
   user: 'cs340_bunnells',
   password: '3436',
   database: 'cs340_bunnells',
   dateStrings: 'true'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.static("layouts"));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4312);
app.set('mysql', mysql);

app.get('/recipes', function(req, res, next){
  pool.query(`SELECT * FROM recipes`, (err, rows, result) => {
    if(err){
      next(err);
      return;
    }
    var storage = [];
    rows.forEach(element => {
      storage.push({
        recipeLink: '/recipes/' + element.recipe_id,
        img: "img/" + element.thumbnail_img,
        recipeName: element.recipe_name
      });
    });
    res.render('recipes', {
      username: "Jackie Chan",
      getRecipe: storage
    });
  });  
});

//app.get('/recipes',function(req, res){
  //res.render('mainRecipes');
//});

app.get('/recipes/:recipe_id', function(req, res, next){
  let query = `SELECT * FROM recipes INNER JOIN recipe_details ON recipes.recipe_id = recipe_details.recipe_id 
  INNER JOIN ingredients ON ingredients.ingredient_id = recipe_details.ingredient_id
  WHERE recipes.recipe_id = ` + req.params.recipe_id;
  pool.query(query, (err, rows, result)=> {
      if(err){
        next(err);
        return;
      }  
      res.render('oneRecipe', {
        username: "Jackie Chan",
        recipeName: rows[0].recipe_name,
        img: "../img/" + rows[0].recipe_img,
        recipeInstructions: rows[0].instructions,
        ingredient: rows,
        recipeSource: "Rocco Dispirito, Katie Caldesi, Giada de Laurentiis, Emeril Lagasse, Jamie Oliver and Alan Rosen & Beth Allen"
      });
  });
});


app.post('/recipes/:recipe_id', (req, res, next) => {
var context = {};
let query = `SELECT * FROM recipes WHERE recipes.recipe_id = ` + ' req.params.recipe_id';
connection.query(query,
  (err, rows, result)=> {
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

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});


app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

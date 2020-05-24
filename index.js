// index.js
// Created: 4/12/2020
// Author: Huy Nguyen <nguyehu6@oregonstate.edu>
// Description: Entry point to the node express app.

let express = require('express');
let mysql = require('./dbcon.js');
let bodyParser = require('body-parser');
let app = express();
let session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

// Handlebars
let handlebars = require('express-handlebars').create({defaultLayout: 'main'});

//mount session
app.use(session({secret: 'secret', resave: true, saveUninitialized: true, signedin: false})); //store secret in .env
app.set('authentication', {'valid':false});

// mount stuff here
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
// app.set('port', process.env.PORT);
app.set('port', 8000);
app.use(express.static('public'));
app.set('mysql', mysql);


// mount routes
app.use('/test', require('./routes/test.js'));
app.use('/admin', require('./routes/admin.js'));
app.use('/dashboard', require('./routes/dashboard.js'));
app.use('/recipes', require('./routes/recipes.js'));
app.use('/posts', require('./routes/posts.js'));
app.use('/comments', require('./routes/comments.js'));
app.use('/calories', require('./routes/calories.js'));
app.use('/signin', require('./routes/signin.js'));
app.use('/signup', require('./routes/signup.js'));
app.use('/signout', require('./routes/signout.js'));


// home page
app.get('/', (req, res) => {
  res.render('home');
})

// 404 error
app.use((req, res) => {
  res.status(404);
  res.render('404');
})

// 500 error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  res.render('500');
})

// run server
app.listen(app.get('port'), function() {
  console.log("Express server started on port:", app.get('port'));
})

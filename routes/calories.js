// calories.js
// author: Kevin Ocampo
// Provides routes for calorie tracker feature.

module.exports = (function() {
  var express = require('express');
  var router = express.Router();
  const moment= require('moment');
  function require_signin (req, res, next) {
    if (!req.session.signedin) {
      res.redirect('/signin');
    } else {
      next();
    }
  };

  router.post('/data', function(req, res, next){
    var user_id = req.session.user_id;
    var date = req.body.date;
    var calories = req.body.calories;
    var mysql = req.app.get('mysql');

    mysql.pool.query("INSERT INTO `calories` (user_id, calorie_date, calorie_in) VALUES (?, ?, ?)", [user_id, date, calories], function(err, result){
      if(err) return next(err);

      console.log("1 record inserted");
      // return;
      // return res.send('Success');
      res.redirect('/calories/')
      // res.end();
    });

  });

  router.get('/delete/:calorie_id', require_signin, function(req, res, next){
    var calorie_id = req.params.calorie_id;
    var user_id = req.session.user_id;
    console.log(calorie_id);
    var calories = req.body.calories;
    var mysql = req.app.get('mysql');

    mysql.pool.query("DELETE FROM calories WHERE calorie_id = ?", calorie_id, function(err, result){
    if(err) return next(err);

    console.log("1 record deleted");
      // return;
      // return res.send('Success');
    res.redirect('/calories/')
      // res.end();
    });

  });

  router.post('/update/:calorie_id', require_signin, function (req, res) {
    var user_id = req.session.user_id;
    var mysql = req.app.get('mysql');
    console.log(req.body);
    console.log("Updating calorie entry:" + req.params.calorie_id);
    var sql = "UPDATE calories SET calorie_in=? WHERE calorie_id=?";
    var inserts = [req.body.calorieUpdate, req.params.calorie_id];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.write(JSON.stringify(error));
            res.end();
            return;
        } else {
            res.redirect('/calories/');
        }
    });
  });

  function genContext(){
    var stuffToDisplay = {};
    stuffToDisplay.time = (new Date(Date.now())).toLocaleTimeString('en-US');
    return stuffToDisplay;
  }

  router.get('/time', require_signin, function(req,res){
    res.render('caloriepage', genContext());
  });

  

  router.get("/", require_signin, (req, res, next) => {
    var context = {};
    context.title = 'Calorie page';
    let query = `SELECT * FROM calories WHERE calories.user_id = ? ORDER BY calorie_date ASC`;
    let query2 = `SELECT * FROM calories WHERE DATE(calorie_date) = CURDATE() AND calories.user_id = ?`;
    var mysql = req.app.get('mysql');
    var user_id = req.session.user_id;
    var username = req.session.username;

    mysql.pool.query(query, user_id, (err, rows, results)=> {
      if(err) return next(err);

      var storage = [];
      var daily_calories = 0;
      var numEntries = rows.length;
      var day_storage = [];
      var sql_date = [];
      var date = [];

      for (var i = 0; i < numEntries; i++) {
        var calorie_left_tracker = 2000 - rows[i].calorie_in;
        var calorie_surplus = 0;

        if((i != 0)){
          for(var k = i - 1; k>=0; k--){
            
            if(rows[i].calorie_date.valueOf() == rows[k].calorie_date.valueOf()){
              var date_deficit = storage[k].calorie_left_tracker;   
              day_storage.push(storage[k].calorie_left_tracker);
                 
            }

          }

          for(var l = 0; l < day_storage.length; l++){
            if(day_storage[l] <= date_deficit){
              smallest_date_deficit = day_storage[l];
              date_deficit = smallest_date_deficit;
            }
              calorie_left_tracker = date_deficit - rows[i].calorie_in;
              
          }
          day_storage = [];
        }



        var calorie_status;


        
        var calorie_left = 0;
        calorie_left = calorie_left_tracker;
        if(calorie_left_tracker < 0){
          calorie_left = 0;
          calorie_surplus = calorie_left_tracker * -1;
        }

        if (calorie_left_tracker > 0) {
          calorie_status = "Deficit";
        } else if (calorie_left_tracker < 0) {
          calorie_status = "Surplus";
        } else if (calorie_left_tracker == 0){
          calorie_status = "Goal";
        }


        storage.push({"username": username, "calorie_id": rows[i].calorie_id, "user_id": user_id, "calorie_date": rows[i].calorie_date,
                      "calorie_in": rows[i].calorie_in, "calorie_status": calorie_status, "calorie_surplus": calorie_surplus,
                      "calorie_left": calorie_left, "calorie_left_tracker": calorie_left_tracker});          
        }
        calorie_left_tracker = 0;



        mysql.pool.query(query2, user_id, (err, rows, results)=> {
          if (err) return next(err);

        if(storage.length > 0){
          console.log("STORAGE > 0");
          var storageReverse = storage.slice().reverse();
          console.log(rows.length);
          console.log("Num entries: " + numEntries)
          if(rows.length > 0){  
            for(var j = 0; j < rows.length; j++){
                  daily_calories = daily_calories + rows[j].calorie_in;
                  storageReverse[numEntries - 1].daily_calories = daily_calories;
                  var calorie_in_percent = (daily_calories / 2000) * 100;
                  if(calorie_in_percent > 100)
                    calorie_in_percent = 100;
               storageReverse[0].calorie_in_percent = calorie_in_percent;
               storageReverse[0].calorie_left_display = calorie_left;
                console.log("ROWS.LENGTH > 0");
            }
          } else if(rows.length === 0){
               storageReverse[0].daily_calories = 0;
               storageReverse[0].calorie_in_percent = 0;
               storageReverse[0].calorie_left_display = 2000;
               storageReverse[0].calorie_status = "Deficit";
                console.log("ROWS.LENGTH == 0");
          }
        }else{
          console.log("STORAGE < 0");
          var storageReverse = [];
        }

        console.log(rows.length === 0);
        console.log(storageReverse);
        console.log(storageReverse[numEntries - 1]);

        context.results = storageReverse;
        storageReverse = [];
        storage = [];
        res.render('caloriepage', context);
        });
    });
  });


  return router;
})();

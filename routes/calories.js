// calories.js
// author: Kevin Ocampo
// Provides routes for calorie tracker feature.

module.exports = (function() {
  var express = require('express');
  var router = express.Router();

  router.post('/data', function(req, res, next){
    var date = req.body.date;
    var calories = req.body.calories;
    var mysql = req.app.get('mysql');

    mysql.pool.query("INSERT INTO `calories` (user_id, calorie_date, calorie_in) VALUES (?, ?, ?)", [1, date.toString(), calories.toString()], function(err, result){
      if(err) return next(err);

      console.log("1 record inserted");
      // return;
      return res.send('Success');
    });

  });

  function genContext(){
    var stuffToDisplay = {};
    stuffToDisplay.time = (new Date(Date.now())).toLocaleTimeString('en-US');
    return stuffToDisplay;
  }

  router.get('/time',function(req,res){
    res.render('caloriepage', genContext());
  });

  router.get("/:user_id", (req, res, next) => {
    var context = {};
    context.title = 'Calorie page';
    let query = `SELECT * FROM calories WHERE calories.user_id = ? ORDER BY calorie_date ASC `;
    let query2 = `SELECT * FROM calories WHERE DATE(calorie_date) = CURDATE()`;
    var mysql = req.app.get('mysql');

    mysql.pool.query(query, req.params.user_id, (err, rows, results)=> {
      if(err) return next(err);

      var storage = [];
      var daily_calories = 0;
      var numEntries = rows.length;
      var day_storage = [];

      for (var i = 0; i < numEntries; i++) {
        var calorie_left = 2000 - rows[i].calorie_in;
        var calorie_surplus = 0;

        if((i != 0)){
          for(var k = i - 1; k>=0; k--){
            var date_deficit = calorie_left;

            if(rows[i].calorie_date == rows[k].calorie_date){
                 day_storage.push(storage[k].calorie_left);
            }
          }

          for(var l = 0; l < day_storage.length; l++){
            if(day_storage[l] < date_deficit){
              smallest_date_deficit = day_storage[l];
              date_deficit = smallest_date_deficit;
            }
              calorie_left = date_deficit - rows[i].calorie_in;
          }
          day_storage = [];
        }

        if (calorie_left < 0){
          calorie_surplus = calorie_left * -1;
          calorie_left = 0;
        }

        var calorie_status;
        if (calorie_left >= 0) {
          calorie_status = "deficit";
        } else {
          calorie_status = "surplus";
        }

        storage.push({"calorie_id": rows[i].calorie_id, "user_id": rows[i].user_id, "calorie_date": rows[i].calorie_date,
                      "calorie_in": rows[i].calorie_in, "calorie_status": calorie_status, "calorie_surplus": calorie_surplus,
                      "calorie_left": calorie_left});
        }

        console.log(storage[numEntries - 1]);

        mysql.pool.query(query2, req.params.user_id, (err, rows, results)=> {
          if (err) return next(err);

          for(var j = 0; j < rows.length; j++)
          {
            daily_calories = daily_calories + rows[j].calorie_in;
            storage[numEntries - 1].daily_calories = daily_calories;
          }

          // TODO: kevin fix this
//                   var calorie_in_percent = (daily_calories / 2000) * 100;
//                   if(calorie_in_percent > 100)
//                     calorie_in_percent = 100;
//                   console.log(calorie_in_percent);
//                   storage[numEntries - 1].calorie_in_percent = calorie_in_percent;

          context.results = storage;
          res.render('caloriepage', context);
        });
    });
  });


  return router;
})();

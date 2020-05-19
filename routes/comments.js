module.exports = function () {

    var express = require('express');
    var router = express.Router();


    // Retrieve all comments
    function getComments(res, mysql, context, complete) {
        mysql.pool.query("SELECT c.comment_id, c.comment_date, u.user_name, p.post_id, c.content FROM comments c INNER JOIN users u ON u.user_id = c.user_id", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
                return;
            }
            context.comments = results;
            complete();
        });
    }

    // Retrieve comments for a single parent post
    function getCommentsByPost(req, res, mysql, context, complete) {
        var query = "SELECT c.comment_id, c.comment_date, u.user_name, p.post_id, c.content FROM comments c INNER JOIN posts p ON c.post_id = p.post_id INNER JOIN users u ON u.user_id = c.user_id WHERE p.post_id = ?";
        console.log(req.params);
        var inserts = [req.params.postID];
        mysql.pool.query(query, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
                return;
            }
            context.comments = results;
            complete();
        });
    }

    // Display all comments for all posts
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getComments(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('comments', context);
            }
        }
    });

    // Display all comments for a single parent post
    router.get('/comments/:postID', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getCommentsByPost(req, res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('comments', context);
            }
        }
    });



    router.post('/create_comment', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO comments (post_id, user_id, content, comment_date) VALUES (?,?,?,?)";
        var date = new Date();
        var inserts = [req.session.user_id, req.body.user_id, req.body.content, date];
        sql = mysql.pool.query(sql, inserts, function (error, results, field) {
            if (error) {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('../posts/' + req.body.post_id);
            }
        });
    });

    return router;
}();

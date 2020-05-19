module.exports = function () {

    var express = require('express');
    var router = express.Router();

    function require_signin (req, res, next) {
      if (!req.session.signedin) {
        res.redirect('/signin');
      } else {
        next();
      }
    };

    // Retrieve all posts
    function getPosts(res, mysql, context, complete) {
        console.log('Retrieving all posts');
        mysql.pool.query("SELECT p.post_id, p.post_date, u.user_name, p.title, p.content FROM posts p INNER JOIN users u ON u.user_id = p.user_id ORDER BY p.post_date ASC", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
                return;
            }
            context.posts = results;
            complete();
        });
    }

    // Retrieve a single post
    function getSinglePost(res, mysql, context, id, complete) {
        console.log('Retrieving a single post');
        var sql = "SELECT p.post_id, p.post_date, u.user_name, p.title, p.content FROM posts p INNER JOIN users u ON u.user_id = p.user_id WHERE post_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
                return;
            }
            context.post = results[0];
            complete();
        });
    }

    // Retrieve comments for a single parent post
    function getCommentsByPost(res, mysql, context, post_id, complete) {
        console.log('Retrieving all comments for post:' + post_id);
        var query = "SELECT c.comment_id, c.comment_date, u.user_name, p.post_id, c.content FROM comments c INNER JOIN posts p ON c.post_id = p.post_id INNER JOIN users u ON u.user_id = c.user_id WHERE p.post_id = ? ORDER BY c.comment_date ASC";
        var inserts = [post_id];
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

    // Display all message board posts
    router.get('/', require_signin, function (req, res) {
        console.log('Accessing the main page');
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getPosts(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('posts', context);
            }
        }
    });

    // Display homepage with flash message
    router.get('/post_submitted', require_signin, function (req, res) {
        console.log('Accessing the main page');
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getPosts(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('first_view', context);
            }
        }
    });

    // Display form to create a new post
    router.get('/create_post_form', require_signin, function (req, res) {
        console.log('This should be loading the form');
        res.render('create_post_form');
    });

    // Display a single message board post
    router.get('/:id', require_signin, function (req, res) {
        console.log('Accessing a single post page');
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getSinglePost(res, mysql, context, req.params.id, complete);
        getCommentsByPost(res, mysql, context, req.params.id, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('post', context);
            }
        }
    });

    // Create a new message board post
    router.post('/create_post', function (req, res) {
        console.log('Inserting into the posts table');
        console.log(req.body);
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO posts (user_id, title, content, post_date) VALUES (?,?,?,?)";
        var date = new Date();
        var inserts = [req.session.user_id, req.body.title, req.body.content, date];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/posts/post_submitted');
            }
        });
    });

    return router;
}();

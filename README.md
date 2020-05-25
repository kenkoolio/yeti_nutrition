# yeti_nutrition

1.	Clone the master repository into your local computer.

MySQL server must be installed, in order to test.

2.	In MySQL server, create a new database name “yeti_eats”.
    a.	source the database ssq file into yeti_eats, “yeti_eats_ddq.sql”
      i.	creates database for yeti_eats.
      ii.	creates tables for yeti_eats database.
    b.	source the database ddl file into yeti_eats, “Dummy_User.sql”
      i.	contains a dummy user id to allow access to app modules.
      
3.	In the source code folder, please open “dbcon.js”
    please make sure to change the pool information in dbcon.js that matches your MySQL server access information.
    var pool = mysql.createPool({
      connectionLimit : 10,
      host            : "localhost",
      user            : "root",
      password        : "password",
      database        : "yeti_eats"
    });
    
4.	For Windows: Open “Git Bash”. For Mac: Open Terminal.

5.	Change command line directory to where the source code was unzipped.

6.	Run “npm install”
  a.	installs all dependencies (packages)

7.	Run application on local server by typing “node index.js”.

8.	You will now have access to the modules created for the alpha version.
  a.	/admin
    i.	User can add recipes to the application
  b.	/recipes
    i.	User can view recipes created in admin
  c.	/posts
    i.	User can view posts, add posts, view comments, add comments.
  d.	/calories/:user_id
    i.	User can add historic calorie intake information in the form available.
  e.    /dashboard
    i.  User dashboard
  f.    /signin
    i.  User sign in page
  g.    /signup
    i.  User creation page
  h     /signout
    i.  User signout page

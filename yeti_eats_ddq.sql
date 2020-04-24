-- Module: yet_eats_ddq.sql
-- Title: Yeti Eats Data Definition Queries
-- Author: Huy (Ken) Nguyen <nguyehu6@oregonstate.edu>

-- Create Database
DROP SCHEMA IF EXISTS `yeti_eats`;
CREATE SCHEMA `yeti_eats`;
USE `yeti_eats`;

-- Users
CREATE TABLE users (
  user_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  user_name VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
)Engine=InnoDB;

-- Posts
CREATE TABLE posts (
  post_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  post_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)Engine=InnoDB;

-- Comments
CREATE TABLE comments (
  comment_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  comment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts (post_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)Engine=InnoDB;

-- Calories
CREATE TABLE calories (
  calorie_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  calorie_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  calorie_in INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)Engine=InnoDB;

-- Recipes
CREATE TABLE recipes (
  recipe_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  recipe_name VARCHAR(255) UNIQUE NOT NULL,
  recipe_img VARCHAR(255),
  total_calories DECIMAL(20, 2) NOT NULL DEFAULT '0.00',
  instructions TEXT NOT NULL
)Engine=InnoDB;

-- Ingredients
CREATE TABLE ingredients (
  ingredient_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  ingredient_name VARCHAR(255) UNIQUE NOT NULL
)Engine=InnoDB;

-- Recipe Details
CREATE TABLE recipe_details (
  recipe_detail_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  recipe_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  quantity INT NOT NULL,
  metric VARCHAR(255) NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes (recipe_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients (ingredient_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)Engine=InnoDB;

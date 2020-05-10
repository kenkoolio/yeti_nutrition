-- phpMyAdmin SQL Dump
-- version 4.9.4
-- https://www.phpmyadmin.net/
--
-- Host: classmysql.engr.oregonstate.edu:3306
-- Generation Time: May 09, 2020 at 05:59 PM
-- Server version: 10.4.11-MariaDB-log
-- PHP Version: 7.4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_bunnells`
--

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `ingredient_id` int(11) NOT NULL,
  `ingredient_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`ingredient_id`, `ingredient_name`) VALUES
(2, 'avocado'),
(1, 'eggs'),
(5, 'herbs'),
(4, 'pepper'),
(6, 'rye bread'),
(3, 'salt');

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `recipe_id` int(11) NOT NULL,
  `recipe_name` varchar(255) NOT NULL,
  `recipe_img` varchar(255) DEFAULT NULL,
  `total_calories` decimal(20,2) NOT NULL DEFAULT 0.00,
  `instructions` text NOT NULL,
  `thumbnail_img` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`recipe_id`, `recipe_name`, `recipe_img`, `total_calories`, `instructions`, `thumbnail_img`) VALUES
(1, 'Celebrity Breakfast', 'stretch.jpg', '386.00', 'This recipe is eaten by a certain famous movie star... and probably all her friends. Hence the name. \r\nMash the avocado with a fork to make it creamy, or cut in thin slices and layer them on the toasted \r\nslices of bread. If you\'ve chosen to mash, add in the salt and pepper, else sprinkle the salt and \r\npepper over the slices. Then sprinkle any savory herbs you prefer. Cilantro, dill, lemon juice, and\r\nitalian seasoning are all excellent options. Just a pinch. \r\nThen, poach your eggs in boiling water for 3 minutes and place those eggs atop the avocado layer. \r\nVoila! You have a powerful breakfast that\'s easy to make, delicious to eat, and super healthy for \r\nyou. \r\nAs alternative options, you can fry your eggs, use a different kind of grain bread, \r\nuse more avocado, and garnish with heirloom tomatoes. The sky\'s the limit, and this is your breakfast. \r\nMake it what you want.', 'egg.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `recipe_details`
--

CREATE TABLE `recipe_details` (
  `recipe_detail_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `metric` varchar(255) NOT NULL,
  `quantity` decimal(20,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `recipe_details`
--

INSERT INTO `recipe_details` (`recipe_detail_id`, `recipe_id`, `ingredient_id`, `metric`, `quantity`) VALUES
(3, 1, 3, 'teaspoon', '0.25'),
(4, 1, 4, 'teaspoon', '0.25'),
(5, 1, 5, 'pinch', '1.00'),
(6, 1, 1, 'large', '2.00'),
(7, 1, 2, 'third', '1.00'),
(11, 1, 6, 'slices', '2.00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`ingredient_id`),
  ADD UNIQUE KEY `ingredient_name` (`ingredient_name`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`recipe_id`),
  ADD UNIQUE KEY `recipe_name` (`recipe_name`);

--
-- Indexes for table `recipe_details`
--
ALTER TABLE `recipe_details`
  ADD PRIMARY KEY (`recipe_detail_id`),
  ADD KEY `recipe_id` (`recipe_id`),
  ADD KEY `ingredient_id` (`ingredient_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `ingredient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `recipe_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `recipe_details`
--
ALTER TABLE `recipe_details`
  MODIFY `recipe_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `recipe_details`
--
ALTER TABLE `recipe_details`
  ADD CONSTRAINT `recipe_details_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `recipe_details_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

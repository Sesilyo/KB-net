-- phpMyAdmin SQL Dump
-- KB-Net: Kuha-Balik Network
-- A Borrowing System for the Student Body
-- CMSC 127 Final Project
--
-- Host: 127.0.0.1
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kb_net`
--

CREATE DATABASE IF NOT EXISTS `kb_net`;
USE `kb_net`;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id`   int(11)      NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_name`) VALUES
('Electronics'),
('School Supplies'),
('Clothing & Accessories'),
('Sports Equipment');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `student_id`    varchar(20)  NOT NULL,
  `lender_id`     varchar(20)  NOT NULL DEFAULT '',
  `borrower_id`   varchar(20)  NOT NULL DEFAULT '',
  `first_name`    varchar(50)  NOT NULL,
  `last_name`     varchar(50)  NOT NULL,
  `email`         varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `lender_id`   (`lender_id`),
  UNIQUE KEY `borrower_id` (`borrower_id`),
  UNIQUE KEY `email`       (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `item_id`     int(11)       NOT NULL AUTO_INCREMENT,
  `category_id` int(11)       NOT NULL,
  `lender_id`   varchar(20)   NOT NULL,
  `item_name`   varchar(100)  NOT NULL,
  `item_status` enum('available','borrowed','unavailable') NOT NULL DEFAULT 'available',
  `price_pr_hr` decimal(10,2) NOT NULL DEFAULT 0.00,
  `image_path`  varchar(500)  DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `category_id` (`category_id`),
  KEY `lender_id`   (`lender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `transaction_id` varchar(20)   NOT NULL DEFAULT '',
  `item_id`        int(11)       NOT NULL,
  `lender_id`      varchar(20)   NOT NULL,
  `borrower_id`    varchar(20)   NOT NULL,
  `start_date`     datetime      NOT NULL,
  `end_date`       datetime      NOT NULL,
  `returned_date`  datetime      DEFAULT NULL,
  `notes`          text          DEFAULT NULL,
  `is_returned`    tinyint(1)    NOT NULL DEFAULT 0,
  `penalty_fee`    decimal(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`transaction_id`),
  KEY `item_id`     (`item_id`),
  KEY `lender_id`   (`lender_id`),
  KEY `borrower_id` (`borrower_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Constraints / Foreign Keys
--

ALTER TABLE `item`
  ADD CONSTRAINT `fk_item_category`
    FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_item_lender`
    FOREIGN KEY (`lender_id`) REFERENCES `user` (`lender_id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `transaction`
  ADD CONSTRAINT `fk_transaction_item`
    FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_transaction_lender`
    FOREIGN KEY (`lender_id`) REFERENCES `user` (`lender_id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_transaction_borrower`
    FOREIGN KEY (`borrower_id`) REFERENCES `user` (`borrower_id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- --------------------------------------------------------

--
-- Trigger: auto-generate lender_id and borrower_id on user insert
--

DELIMITER $$

CREATE TRIGGER `before_insert_user`
BEFORE INSERT ON `user`
FOR EACH ROW
BEGIN
  DECLARE next_num INT;

  SELECT COALESCE(MAX(CAST(SUBSTRING(lender_id, 3) AS UNSIGNED)), 0) + 1
    INTO next_num
    FROM `user`;

  SET NEW.lender_id   = CONCAT('L-', LPAD(next_num, 4, '0'));
  SET NEW.borrower_id = CONCAT('B-', LPAD(next_num, 4, '0'));
END$$

-- --------------------------------------------------------

--
-- Trigger: auto-generate transaction_id on transaction insert
--

CREATE TRIGGER `before_insert_transaction`
BEFORE INSERT ON `transaction`
FOR EACH ROW
BEGIN
  DECLARE next_num INT;

  SELECT COALESCE(MAX(CAST(SUBSTRING(transaction_id, 3) AS UNSIGNED)), 0) + 1
    INTO next_num
    FROM `transaction`;

  SET NEW.transaction_id = CONCAT('T-', LPAD(next_num, 4, '0'));
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Dumping data for table `user`
-- (lender_id and borrower_id are auto-generated by trigger)
--

INSERT INTO `user` (`student_id`, `first_name`, `last_name`, `email`, `password_hash`) VALUES
('2024-00001', 'Luis Victor',     'Borbolla',  'lborbolla@up.edu.ph',   'eljhdfnjhesrfes'),
('2024-00002', 'Seth Leander',    'Caballero', 'slcaballero@up.edu.ph', 'asdjxn2iu1h3'),
('2024-00003', 'Erine Lourdes',   'Medalla',   'elmedalla@up.edu.ph',   '$asdksalk2'),
('2024-00004', 'Ryona Cassandra', 'Honrado',   'rphonrado@up.edu.ph',   '$2y$10$asds');

--
-- Dumping data for table `item`
-- (item_id is auto-generated by AUTO_INCREMENT)
--

INSERT INTO `item` (`category_id`, `lender_id`, `item_name`, `item_status`, `price_pr_hr`, `image_path`) VALUES
(4, 'L-0001', 'Shinguard',       'available',  5.00, 'uploads/items/shinguard.jpg'),
(4, 'L-0001', 'Boxing Gloves',   'borrowed',  10.00, 'uploads/items/boxing_gloves.jpg'),
(4, 'L-0002', 'Mouthguard',      'available',  2.00, 'uploads/items/mouthguard.jpg'),
(4, 'L-0002', 'Hand Wraps 3.5m', 'available',  2.00, 'uploads/items/hand_wraps.jpg'),
(3, 'L-0003', 'Socks',           'available',  3.00, 'uploads/items/socks.jpg'),
(2, 'L-0004', 'Muji Pen',        'borrowed',   1.50, 'uploads/items/muji_pen.jpg');

--
-- Dumping data for table `transaction`
-- (transaction_id is auto-generated by trigger)
--

INSERT INTO `transaction` (`item_id`, `lender_id`, `borrower_id`, `start_date`, `end_date`, `returned_date`, `notes`, `is_returned`, `penalty_fee`) VALUES
(2, 'L-0001', 'B-0002', '2024-01-10 08:00:00', '2024-01-12 08:00:00', '2024-01-12 07:45:00', 'Handle with care.',      1, 0.00),
(6, 'L-0004', 'B-0001', '2024-01-15 09:00:00', '2024-01-15 18:00:00', NULL,                  'Return before 6PM.',     0, 0.00),
(1, 'L-0001', 'B-0003', '2024-01-20 10:00:00', '2024-01-22 10:00:00', '2024-01-23 11:00:00', 'Returned one day late.', 1, 5.00),
(3, 'L-0002', 'B-0004', '2024-02-01 08:00:00', '2024-02-03 08:00:00', '2024-02-03 08:00:00', NULL,                     1, 0.00);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
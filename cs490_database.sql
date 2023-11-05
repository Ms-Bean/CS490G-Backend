-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: cs490_database
-- ------------------------------------------------------
-- Server version	8.0.35-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Addresses`
--

DROP TABLE IF EXISTS `Addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Addresses` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(255) NOT NULL,
  `city_id` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `zip_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`address_id`),
  KEY `city_id` (`city_id`),
  CONSTRAINT `Addresses_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `Cities` (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Appointments`
--

DROP TABLE IF EXISTS `Appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Appointments` (
  `description` text NOT NULL,
  `client_id` int NOT NULL,
  `coach_id` int NOT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `begin_time` timestamp NOT NULL,
  `time_duration` time NOT NULL,
  PRIMARY KEY (`client_id`,`coach_id`),
  KEY `coach_id` (`coach_id`),
  CONSTRAINT `Appointments_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Appointments_ibfk_2` FOREIGN KEY (`coach_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Cities`
--

DROP TABLE IF EXISTS `Cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Cities` (
  `city_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `City_Country`
--

DROP TABLE IF EXISTS `City_Country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `City_Country` (
  `city_id` int NOT NULL,
  `country_id` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`city_id`),
  KEY `country_id` (`country_id`),
  CONSTRAINT `City_Country_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `Cities` (`city_id`),
  CONSTRAINT `City_Country_ibfk_2` FOREIGN KEY (`country_id`) REFERENCES `Countries` (`country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `City_State`
--

DROP TABLE IF EXISTS `City_State`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `City_State` (
  `city_id` int NOT NULL,
  `state_id` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`city_id`),
  KEY `state_id` (`state_id`),
  CONSTRAINT `City_State_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `Cities` (`city_id`),
  CONSTRAINT `City_State_ibfk_2` FOREIGN KEY (`state_id`) REFERENCES `States` (`state_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Client_Coach`
--

DROP TABLE IF EXISTS `Client_Coach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Client_Coach` (
  `client_id` int NOT NULL,
  `coach_id` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`client_id`),
  KEY `coach_id` (`coach_id`),
  CONSTRAINT `Client_Coach_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Client_Coach_ibfk_2` FOREIGN KEY (`coach_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Coach_Requests`
--

DROP TABLE IF EXISTS `Coach_Requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Coach_Requests` (
  `coach_id` int NOT NULL,
  `client_id` int NOT NULL,
  `comment` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`coach_id`,`client_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `Coach_Requests_ibfk_1` FOREIGN KEY (`coach_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Coach_Requests_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Coaches`
--

DROP TABLE IF EXISTS `Coaches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Coaches` (
  `user_id` int NOT NULL,
  `availability` text NOT NULL,
  `hourly_rate` float NOT NULL,
  `coaching_history` text NOT NULL,
  `accepting_new_clients` tinyint(1) NOT NULL,
  `experience_level` int NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `Coaches_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Coaches_Goals`
--

DROP TABLE IF EXISTS `Coaches_Goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Coaches_Goals` (
  `coach_id` int NOT NULL,
  `goal` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`coach_id`,`goal`),
  CONSTRAINT `Coaches_Goals_ibfk_1` FOREIGN KEY (`coach_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Countries`
--

DROP TABLE IF EXISTS `Countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Countries` (
  `country_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Exercise_Bank`
--

DROP TABLE IF EXISTS `Exercise_Bank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Exercise_Bank` (
  `exercise_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`exercise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Messages`
--

DROP TABLE IF EXISTS `Messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `coach_id` int NOT NULL,
  `client_id` int NOT NULL,
  `content` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`),
  KEY `coach_id` (`coach_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`coach_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Messages_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Photo_Progression`
--

DROP TABLE IF EXISTS `Photo_Progression`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Photo_Progression` (
  `image` blob NOT NULL,
  `user_id` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`created`),
  CONSTRAINT `Photo_Progression_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Ratings`
--

DROP TABLE IF EXISTS `Ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Ratings` (
  `coach_id` int NOT NULL,
  `client_id` int NOT NULL,
  `comment` text NOT NULL,
  `rating` decimal(3,2) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`coach_id`,`client_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `Ratings_ibfk_1` FOREIGN KEY (`coach_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Ratings_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `State_Country`
--

DROP TABLE IF EXISTS `State_Country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `State_Country` (
  `state_id` int NOT NULL,
  `country_id` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`state_id`),
  KEY `country_id` (`country_id`),
  CONSTRAINT `State_Country_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `States` (`state_id`),
  CONSTRAINT `State_Country_ibfk_2` FOREIGN KEY (`country_id`) REFERENCES `Countries` (`country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `States`
--

DROP TABLE IF EXISTS `States`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `States` (
  `state_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`state_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `User_Daily_Survey`
--

DROP TABLE IF EXISTS `User_Daily_Survey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User_Daily_Survey` (
  `calories_consumed` int DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `calories_burned` int DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `date` date NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`date`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `User_Daily_Survey_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `User_Location`
--

DROP TABLE IF EXISTS `User_Location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User_Location` (
  `user_id` int NOT NULL,
  `address_id` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `User_Location_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `User_Location_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `Addresses` (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `User_Profile`
--

DROP TABLE IF EXISTS `User_Profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User_Profile` (
  `user_id` int NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `profile_picture` blob,
  `about_me` text,
  `experience_level` varchar(255) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `height` float DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `medical_conditions` text,
  `budget` int DEFAULT NULL,
  `goals` text,
  `target_weight` float DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `User_Profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `User_Workout_Plan`
--

DROP TABLE IF EXISTS `User_Workout_Plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User_Workout_Plan` (
  `user_id` int NOT NULL,
  `workout_plan_id` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  KEY `workout_plan_id` (`workout_plan_id`),
  CONSTRAINT `User_Workout_Plan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `User_Workout_Plan_ibfk_2` FOREIGN KEY (`workout_plan_id`) REFERENCES `Workout_Plans` (`workout_plan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password_salt` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `username` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Workout_Plan_Exercises`
--

DROP TABLE IF EXISTS `Workout_Plan_Exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Workout_Plan_Exercises` (
  `workout_plan_id` int NOT NULL,
  `exercise_id` int NOT NULL,
  `weekday` varchar(255) NOT NULL,
  `time` time NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`workout_plan_id`,`exercise_id`,`weekday`,`time`),
  KEY `exercise_id` (`exercise_id`),
  CONSTRAINT `Workout_Plan_Exercises_ibfk_1` FOREIGN KEY (`workout_plan_id`) REFERENCES `Workout_Plans` (`workout_plan_id`),
  CONSTRAINT `Workout_Plan_Exercises_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `Exercise_Bank` (`exercise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Workout_Plans`
--

DROP TABLE IF EXISTS `Workout_Plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Workout_Plans` (
  `workout_plan_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`workout_plan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-05  1:20:43

-- MySQL dump 10.13  Distrib 8.0.34, for Linux (x86_64)
--
-- Host: localhost    Database: cs490_database
-- ------------------------------------------------------
-- Server version	8.0.34-0ubuntu0.22.04.1

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
-- Current Database: `cs490_database`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `cs490_database` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `cs490_database`;

--
-- Table structure for table `Appointments`
--

DROP TABLE IF EXISTS `Appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Appointments` (
  `client_id` int NOT NULL,
  `coach_id` int NOT NULL,
  `description` text NOT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `duration` time DEFAULT NULL,
  KEY `client_id` (`client_id`),
  KEY `coach_id` (`coach_id`),
  CONSTRAINT `Appointments_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Clients` (`user_id`),
  CONSTRAINT `Appointments_ibfk_2` FOREIGN KEY (`coach_id`) REFERENCES `Coaches` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Appointments`
--

LOCK TABLES `Appointments` WRITE;
/*!40000 ALTER TABLE `Appointments` DISABLE KEYS */;
/*!40000 ALTER TABLE `Appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Clients`
--

DROP TABLE IF EXISTS `Clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Clients` (
  `user_id` int NOT NULL,
  `goals` text,
  `medical_conditions` text,
  `workout_plan_id` int DEFAULT NULL,
  `dietary_restrictions` text,
  `coach_id` int DEFAULT NULL,
  `workout_plan_start_date` date DEFAULT NULL,
  `target_weight_pounds` int DEFAULT NULL,
  `target_daily_water_intake` int DEFAULT NULL,
  `target_daily_hours_of_sleep` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `coach_id` (`coach_id`),
  KEY `workout_plan_id` (`workout_plan_id`),
  CONSTRAINT `Clients_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `Clients_ibfk_2` FOREIGN KEY (`coach_id`) REFERENCES `Coaches` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `Clients_ibfk_3` FOREIGN KEY (`workout_plan_id`) REFERENCES `Workout_Plans` (`workout_plan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Clients`
--

LOCK TABLES `Clients` WRITE;
/*!40000 ALTER TABLE `Clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `Clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Coach_Requests`
--

DROP TABLE IF EXISTS `Coach_Requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Coach_Requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `coach_id` int NOT NULL,
  `client_id` int NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`request_id`),
  KEY `coach_id` (`coach_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `Coach_Requests_ibfk_1` FOREIGN KEY (`coach_id`) REFERENCES `Coaches` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `Coach_Requests_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `Clients` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Coach_Requests`
--

LOCK TABLES `Coach_Requests` WRITE;
/*!40000 ALTER TABLE `Coach_Requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `Coach_Requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Coaches`
--

DROP TABLE IF EXISTS `Coaches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Coaches` (
  `user_id` int NOT NULL,
  `hourly_rate` float DEFAULT NULL,
  `accepting_new_clients` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  CONSTRAINT `Coaches_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `hourly_rate_accepting_new_clients_chk` CHECK (((`accepting_new_clients` = 0) or (`hourly_rate` is not null)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Coaches`
--

LOCK TABLES `Coaches` WRITE;
/*!40000 ALTER TABLE `Coaches` DISABLE KEYS */;
/*!40000 ALTER TABLE `Coaches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Exercise_Bank`
--

DROP TABLE IF EXISTS `Exercise_Bank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Exercise_Bank` (
  `exercise_id` int NOT NULL AUTO_INCREMENT,
  `exercise_description` text NOT NULL,
  PRIMARY KEY (`exercise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Exercise_Bank`
--

LOCK TABLES `Exercise_Bank` WRITE;
/*!40000 ALTER TABLE `Exercise_Bank` DISABLE KEYS */;
/*!40000 ALTER TABLE `Exercise_Bank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Exercise_Logs`
--

DROP TABLE IF EXISTS `Exercise_Logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Exercise_Logs` (
  `exercise_name` varchar(255) NOT NULL,
  `start_timestamp` timestamp NOT NULL,
  `end_timestamp` timestamp NOT NULL,
  `client_id` int NOT NULL,
  `reps` int DEFAULT NULL,
  `sets` int DEFAULT NULL,
  `calories_burned` int DEFAULT NULL,
  KEY `client_id` (`client_id`),
  CONSTRAINT `Exercise_Logs_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Clients` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Exercise_Logs`
--

LOCK TABLES `Exercise_Logs` WRITE;
/*!40000 ALTER TABLE `Exercise_Logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `Exercise_Logs` ENABLE KEYS */;
UNLOCK TABLES;

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
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`),
  KEY `coach_id` (`coach_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`coach_id`) REFERENCES `Coaches` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `Messages_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `Clients` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Messages`
--

LOCK TABLES `Messages` WRITE;
/*!40000 ALTER TABLE `Messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `Messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Ratings`
--

DROP TABLE IF EXISTS `Ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Ratings` (
  `rating_id` int NOT NULL AUTO_INCREMENT,
  `rating` decimal(3,2) NOT NULL,
  `coach_id` int NOT NULL,
  `comment` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `client_id` int DEFAULT NULL,
  PRIMARY KEY (`rating_id`),
  KEY `coach_id` (`coach_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `Ratings_ibfk_2` FOREIGN KEY (`coach_id`) REFERENCES `Coaches` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `Ratings_ibfk_3` FOREIGN KEY (`client_id`) REFERENCES `Clients` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `rating_between_1_and_5` CHECK (((`rating` >= 0) and (`rating` <= 5.0)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Ratings`
--

LOCK TABLES `Ratings` WRITE;
/*!40000 ALTER TABLE `Ratings` DISABLE KEYS */;
/*!40000 ALTER TABLE `Ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Status_Logs`
--

DROP TABLE IF EXISTS `Status_Logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Status_Logs` (
  `daily_water_intake_liters` float DEFAULT NULL,
  `hours_of_sleep_per_night` float DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `calories_per_day` int DEFAULT NULL,
  `client_id` int NOT NULL,
  `date` date NOT NULL,
  `height_cm` float DEFAULT NULL,
  KEY `client_id` (`client_id`),
  CONSTRAINT `Status_Logs_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Clients` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Status_Logs`
--

LOCK TABLES `Status_Logs` WRITE;
/*!40000 ALTER TABLE `Status_Logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `Status_Logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password_salt` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `country` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `location_longitude` decimal(10,7) DEFAULT NULL,
  `location_latitude` decimal(10,7) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `about_me` text,
  `profile_picture` blob,
  `phone` int DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `longitude_latitude_bound` CHECK (((`location_longitude` >= -(180)) and (`location_longitude` <= 180) and (`location_latitude` >= -(90)) and (`location_latitude` <= 90)))
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Workout_Plan_Exercises`
--

DROP TABLE IF EXISTS `Workout_Plan_Exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Workout_Plan_Exercises` (
  `workout_plan_id` int DEFAULT NULL,
  `exercise_id` int DEFAULT NULL,
  `workout_plan_exercise_id` int NOT NULL AUTO_INCREMENT,
  `reps` int DEFAULT NULL,
  `start_weekday` int NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `sets` int DEFAULT NULL,
  PRIMARY KEY (`workout_plan_exercise_id`),
  KEY `workout_plan_id` (`workout_plan_id`),
  KEY `exercise_id` (`exercise_id`),
  CONSTRAINT `Workout_Plan_Exercises_ibfk_1` FOREIGN KEY (`workout_plan_id`) REFERENCES `Workout_Plans` (`workout_plan_id`) ON DELETE CASCADE,
  CONSTRAINT `Workout_Plan_Exercises_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `Exercise_Bank` (`exercise_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Workout_Plan_Exercises`
--

LOCK TABLES `Workout_Plan_Exercises` WRITE;
/*!40000 ALTER TABLE `Workout_Plan_Exercises` DISABLE KEYS */;
/*!40000 ALTER TABLE `Workout_Plan_Exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Workout_Plan_Logs`
--

DROP TABLE IF EXISTS `Workout_Plan_Logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Workout_Plan_Logs` (
  `client_id` int NOT NULL,
  `workout_plan_name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  KEY `client_id` (`client_id`),
  CONSTRAINT `Workout_Plan_Logs_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Clients` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Workout_Plan_Logs`
--

LOCK TABLES `Workout_Plan_Logs` WRITE;
/*!40000 ALTER TABLE `Workout_Plan_Logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `Workout_Plan_Logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Workout_Plans`
--

DROP TABLE IF EXISTS `Workout_Plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Workout_Plans` (
  `workout_plan_id` int NOT NULL AUTO_INCREMENT,
  `workout_plan_name` varchar(255) NOT NULL,
  UNIQUE KEY `workout_plan_id` (`workout_plan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Workout_Plans`
--

LOCK TABLES `Workout_Plans` WRITE;
/*!40000 ALTER TABLE `Workout_Plans` DISABLE KEYS */;
/*!40000 ALTER TABLE `Workout_Plans` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-29  9:11:53

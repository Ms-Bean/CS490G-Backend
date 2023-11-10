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
-- Table structure for table `Address_City`
--

DROP TABLE IF EXISTS `Address_City`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Address_City` (
  `address_id` int NOT NULL,
  `city_id` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`address_id`),
  KEY `city_id` (`city_id`),
  CONSTRAINT `Address_City_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `Addresses` (`address_id`),
  CONSTRAINT `Address_City_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `Cities` (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Address_City`
--

LOCK TABLES `Address_City` WRITE;
/*!40000 ALTER TABLE `Address_City` DISABLE KEYS */;
/*!40000 ALTER TABLE `Address_City` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Addresses`
--

DROP TABLE IF EXISTS `Addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Addresses` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `zip_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Addresses`
--

LOCK TABLES `Addresses` WRITE;
/*!40000 ALTER TABLE `Addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `Addresses` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `Appointments`
--

LOCK TABLES `Appointments` WRITE;
/*!40000 ALTER TABLE `Appointments` DISABLE KEYS */;
/*!40000 ALTER TABLE `Appointments` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cities`
--

LOCK TABLES `Cities` WRITE;
/*!40000 ALTER TABLE `Cities` DISABLE KEYS */;
/*!40000 ALTER TABLE `Cities` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `City_State`
--

LOCK TABLES `City_State` WRITE;
/*!40000 ALTER TABLE `City_State` DISABLE KEYS */;
/*!40000 ALTER TABLE `City_State` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `Client_Coach`
--

LOCK TABLES `Client_Coach` WRITE;
/*!40000 ALTER TABLE `Client_Coach` DISABLE KEYS */;
/*!40000 ALTER TABLE `Client_Coach` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `Coaches`
--

LOCK TABLES `Coaches` WRITE;
/*!40000 ALTER TABLE `Coaches` DISABLE KEYS */;
/*!40000 ALTER TABLE `Coaches` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `Coaches_Goals`
--

LOCK TABLES `Coaches_Goals` WRITE;
/*!40000 ALTER TABLE `Coaches_Goals` DISABLE KEYS */;
/*!40000 ALTER TABLE `Coaches_Goals` ENABLE KEYS */;
UNLOCK TABLES;

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
  `user_who_created_it` int NOT NULL,
  PRIMARY KEY (`exercise_id`),
  KEY `user_who_created_it` (`user_who_created_it`),
  CONSTRAINT `Exercise_Bank_ibfk_1` FOREIGN KEY (`user_who_created_it`) REFERENCES `Users` (`user_id`)
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
-- Dumping data for table `Messages`
--

LOCK TABLES `Messages` WRITE;
/*!40000 ALTER TABLE `Messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `Messages` ENABLE KEYS */;
UNLOCK TABLES;

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
  `time_taken` timestamp NOT NULL,
  PRIMARY KEY (`user_id`,`time_taken`),
  CONSTRAINT `Photo_Progression_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Photo_Progression`
--

LOCK TABLES `Photo_Progression` WRITE;
/*!40000 ALTER TABLE `Photo_Progression` DISABLE KEYS */;
/*!40000 ALTER TABLE `Photo_Progression` ENABLE KEYS */;
UNLOCK TABLES;

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
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `rating` int NOT NULL,
  PRIMARY KEY (`coach_id`,`client_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `Ratings_ibfk_1` FOREIGN KEY (`coach_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Ratings_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `Users` (`user_id`)
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
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `States`
--

LOCK TABLES `States` WRITE;
/*!40000 ALTER TABLE `States` DISABLE KEYS */;
INSERT INTO `States` VALUES (16,'AL','2023-11-09 05:03:48','2023-11-09 05:03:48'),(17,'AK','2023-11-09 05:03:53','2023-11-09 05:03:53'),(18,'AZ','2023-11-09 05:03:56','2023-11-09 05:03:56'),(19,'AR','2023-11-09 05:03:57','2023-11-09 05:03:57'),(20,'CA','2023-11-09 05:04:01','2023-11-09 05:04:01'),(21,'CO','2023-11-09 05:04:05','2023-11-09 05:04:05'),(22,'CT','2023-11-09 05:04:07','2023-11-09 05:04:07'),(23,'DE','2023-11-09 05:04:10','2023-11-09 05:04:10'),(24,'DC','2023-11-09 05:04:17','2023-11-09 05:04:17'),(25,'FL','2023-11-09 05:04:22','2023-11-09 05:04:22'),(26,'GA','2023-11-09 05:04:25','2023-11-09 05:04:25'),(27,'HI','2023-11-09 05:04:30','2023-11-09 05:04:30'),(28,'ID','2023-11-09 05:04:33','2023-11-09 05:04:33'),(29,'IL','2023-11-09 05:04:37','2023-11-09 05:04:37'),(30,'IN','2023-11-09 05:04:38','2023-11-09 05:04:38'),(31,'IA','2023-11-09 05:04:41','2023-11-09 05:04:41'),(32,'KS','2023-11-09 05:04:44','2023-11-09 05:04:44'),(33,'KY','2023-11-09 05:04:46','2023-11-09 05:04:46'),(34,'LA','2023-11-09 05:04:51','2023-11-09 05:04:51'),(35,'ME','2023-11-09 05:04:55','2023-11-09 05:04:55'),(36,'MD','2023-11-09 05:04:58','2023-11-09 05:04:58'),(37,'MA','2023-11-09 05:05:01','2023-11-09 05:05:01'),(38,'MI','2023-11-09 05:05:04','2023-11-09 05:05:04'),(39,'MN','2023-11-09 05:05:07','2023-11-09 05:05:07'),(40,'MS','2023-11-09 05:05:09','2023-11-09 05:05:09'),(41,'MO','2023-11-09 05:05:25','2023-11-09 05:05:25'),(42,'MT','2023-11-09 05:05:31','2023-11-09 05:05:31'),(43,'NE','2023-11-09 05:05:36','2023-11-09 05:05:36'),(44,'NV','2023-11-09 05:05:38','2023-11-09 05:05:38'),(45,'NH','2023-11-09 05:05:41','2023-11-09 05:05:41'),(46,'NJ','2023-11-09 05:05:44','2023-11-09 05:05:44'),(47,'NM','2023-11-09 05:05:47','2023-11-09 05:05:47'),(48,'NY','2023-11-09 05:05:52','2023-11-09 05:05:52'),(49,'NC','2023-11-09 05:05:55','2023-11-09 05:05:55'),(50,'ND','2023-11-09 05:05:56','2023-11-09 05:05:56'),(51,'OH','2023-11-09 05:06:00','2023-11-09 05:06:00'),(52,'OK','2023-11-09 05:06:03','2023-11-09 05:06:03'),(53,'OR','2023-11-09 05:06:05','2023-11-09 05:06:05'),(54,'PA','2023-11-09 05:06:11','2023-11-09 05:06:11'),(55,'RI','2023-11-09 05:06:14','2023-11-09 05:06:14'),(56,'SC','2023-11-09 05:06:17','2023-11-09 05:06:17'),(57,'SD','2023-11-09 05:06:20','2023-11-09 05:06:20'),(58,'TN','2023-11-09 05:06:23','2023-11-09 05:06:23'),(59,'TX','2023-11-09 05:06:24','2023-11-09 05:06:24'),(60,'UT','2023-11-09 05:06:28','2023-11-09 05:06:28'),(61,'VT','2023-11-09 05:06:31','2023-11-09 05:06:31'),(62,'VA','2023-11-09 05:06:33','2023-11-09 05:06:33'),(63,'WA','2023-11-09 05:06:36','2023-11-09 05:06:36'),(64,'WV','2023-11-09 05:06:38','2023-11-09 05:06:38'),(65,'WI','2023-11-09 05:06:41','2023-11-09 05:06:41'),(66,'WY','2023-11-09 05:06:44','2023-11-09 05:06:44'),(67,'CM','2023-11-09 05:08:39','2023-11-09 05:08:39'),(68,'UM','2023-11-09 05:08:57','2023-11-09 05:08:57'),(69,'GU','2023-11-09 05:09:23','2023-11-09 05:09:23'),(70,'UM-81','2023-11-09 05:10:37','2023-11-09 05:10:37'),(71,'UM-84','2023-11-09 05:11:39','2023-11-09 05:11:39'),(72,'UM-86','2023-11-09 05:11:42','2023-11-09 05:11:42'),(73,'UM-67','2023-11-09 05:11:44','2023-11-09 05:11:44'),(74,'UM-89','2023-11-09 05:11:47','2023-11-09 05:11:47'),(75,'UM-71','2023-11-09 05:11:49','2023-11-09 05:11:49'),(76,'UM-76','2023-11-09 05:11:52','2023-11-09 05:11:52'),(77,'UM-95','2023-11-09 05:12:01','2023-11-09 05:12:01'),(78,'UM-79','2023-11-09 05:12:05','2023-11-09 05:12:05');
/*!40000 ALTER TABLE `States` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `User_Daily_Survey`
--

LOCK TABLES `User_Daily_Survey` WRITE;
/*!40000 ALTER TABLE `User_Daily_Survey` DISABLE KEYS */;
/*!40000 ALTER TABLE `User_Daily_Survey` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `User_Location`
--

LOCK TABLES `User_Location` WRITE;
/*!40000 ALTER TABLE `User_Location` DISABLE KEYS */;
/*!40000 ALTER TABLE `User_Location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_Profile`
--

DROP TABLE IF EXISTS `User_Profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User_Profile` (
  `user_id` int NOT NULL,
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
-- Dumping data for table `User_Profile`
--

LOCK TABLES `User_Profile` WRITE;
/*!40000 ALTER TABLE `User_Profile` DISABLE KEYS */;
/*!40000 ALTER TABLE `User_Profile` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `User_Workout_Plan`
--

LOCK TABLES `User_Workout_Plan` WRITE;
/*!40000 ALTER TABLE `User_Workout_Plan` DISABLE KEYS */;
/*!40000 ALTER TABLE `User_Workout_Plan` ENABLE KEYS */;
UNLOCK TABLES;

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
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
-- Dumping data for table `Workout_Plan_Exercises`
--

LOCK TABLES `Workout_Plan_Exercises` WRITE;
/*!40000 ALTER TABLE `Workout_Plan_Exercises` DISABLE KEYS */;
/*!40000 ALTER TABLE `Workout_Plan_Exercises` ENABLE KEYS */;
UNLOCK TABLES;

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
  `user_who_created_it` int NOT NULL,
  PRIMARY KEY (`workout_plan_id`),
  KEY `user_who_created_it` (`user_who_created_it`),
  CONSTRAINT `Workout_Plans_ibfk_1` FOREIGN KEY (`user_who_created_it`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Workout_Plans`
--

LOCK TABLES `Workout_Plans` WRITE;
/*!40000 ALTER TABLE `Workout_Plans` DISABLE KEYS */;
/*!40000 ALTER TABLE `Workout_Plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Workout_Progress`
--

DROP TABLE IF EXISTS `Workout_Progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Workout_Progress` (
  `user_id` int NOT NULL,
  `date` date NOT NULL,
  `workout_plan_id` int NOT NULL,
  `exercise_id` int NOT NULL,
  `weekday` varchar(255) NOT NULL,
  `time` time NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `set_number` int DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `reps` int DEFAULT NULL,
  PRIMARY KEY (`user_id`,`date`,`workout_plan_id`,`exercise_id`,`weekday`,`time`),
  KEY `workout_plan_id` (`workout_plan_id`,`exercise_id`,`weekday`,`time`),
  CONSTRAINT `Workout_Progress_ibfk_1` FOREIGN KEY (`workout_plan_id`, `exercise_id`, `weekday`, `time`) REFERENCES `Workout_Plan_Exercises` (`workout_plan_id`, `exercise_id`, `weekday`, `time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Workout_Progress`
--

LOCK TABLES `Workout_Progress` WRITE;
/*!40000 ALTER TABLE `Workout_Progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `Workout_Progress` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-09 20:19:38

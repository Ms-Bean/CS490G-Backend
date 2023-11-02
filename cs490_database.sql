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
  `budget` float DEFAULT NULL,
  `experience_level` varchar(255) DEFAULT NULL,
  `weight` float DEFAULT NULL,
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
INSERT INTO `Clients` VALUES (45,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(46,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(47,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(48,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(50,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(51,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(61,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(62,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(63,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(64,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(65,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(66,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(67,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(68,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(69,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(70,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(71,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(72,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(73,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(74,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(75,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(76,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(77,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(78,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(79,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(80,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(81,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(82,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(83,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(84,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(85,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
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
  `availability` text NOT NULL,
  `hourly_rate` float NOT NULL,
  `experience` text NOT NULL,
  `accepting_new_clients` tinyint(1) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `Coaches_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Coaches`
--

LOCK TABLES `Coaches` WRITE;
/*!40000 ALTER TABLE `Coaches` DISABLE KEYS */;
INSERT INTO `Coaches` VALUES (49,'',0,'',0),(59,'This coach has not indicated their availability',0,'This coach has not indicated their experience',0),(60,'This coach has not indicated their availability',0,'This coach has not indicated their experience',0);
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
  `role` varchar(255) NOT NULL,
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `longitude_latitude_bound` CHECK (((`location_longitude` >= -(180)) and (`location_longitude` <= 180) and (`location_latitude` >= -(90)) and (`location_latitude` <= 90)))
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (38,'k','k','k@njit.edu','$2b$10$dJwMI4D72EW1TnB2kZkQIeryv9tF8u.z.2DNL0jh9IiyvOTLs1YOa','4DRcnAvtuT','2023-11-01 03:24:26','2023-11-01 05:44:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'k','client'),(39,'jj','jj','jj@njit.edu','$2b$10$21urN2xucct8byIi8WkAUeApJlxkJDlYtmRg6EtN8kXV0BlDUWmlO','hGhKBieZLl','2023-11-01 03:26:27','2023-11-01 05:44:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jj','client'),(40,'hh','hh','hh@njit.edu','$2b$10$xsGLlcAcAgH6SvrVM.CALe4Bd3jJqAUxmk9QhIq90D0UOzk6NSrY6','c6IL!L(c%G','2023-11-01 03:27:26','2023-11-01 05:44:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'hh','client'),(41,'vv','vv','vv@njit.edu','$2b$10$0jUFmRwS6ktP6DXG7fVd5.5swktVqPxbjBLI5JK.KSkj3KBupxpgC','c%9Hw1tnBP','2023-11-01 03:29:43','2023-11-01 05:44:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'vv','client'),(42,'hh','hh','hh@njit.edu','$2b$10$t879vvYuTTAjhN9LCf9XkesSNqQo94lbdDNtYnCL/w23.Jtn7Sccq','HkzHZ!Ome(','2023-11-01 03:35:00','2023-11-01 05:44:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'sdfg','client'),(43,'uuu','uuu','uuu@njit.edu','$2b$10$2q5EK.vfgJfRmhIlHC2IuOZ5vnL.GTXVk.WFhtnoNlqwk8dpopLkm','7DfFUCaa)s','2023-11-01 04:14:12','2023-11-01 05:44:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'uuu','client'),(44,'ddd','ddd','ddd@njit.edu','$2b$10$FAX6UF5bN5/a9GRXsj5jc.0KU1jvPIjOg76.ZhksfccULeiMw2KdS','7jnIo5*Mck','2023-11-01 04:18:35','2023-11-01 05:44:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ddd','client'),(45,'sss','sss','sss@njit.edu','$2b$10$y4eFsnoBrD7ftnk5ckJaj.z9PQb3ZqyxZMT./vIgaJdRbQuLF5ZIi','I)ClQ(QReS','2023-11-01 04:21:48','2023-11-01 05:44:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'sss','client'),(46,'ooo','ooo','ooo@njit.edu','$2b$10$BAAgvLNmiP8b0mLoon412Oi43GFz5o/A/Ebl08ljigtCtF3Ma3lvy','^urAcC64xP','2023-11-01 04:22:34','2023-11-01 05:44:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'000','client'),(47,'iii','iii','iii@njit.edu','$2b$10$U2.d/tSej/NNSZF94N7fiuvvEofFNp1DVGW7fMrwgyHQh2QJ4uhpa','3$rLYfDLhZ','2023-11-01 04:23:53','2023-11-01 05:44:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'iii','client'),(48,'jjj','jjj','jjj@njit.edu','$2b$10$TsmlA8TtDSnq.UdDaZa5QOYeQqV.hZPIWxyOC8CHWwj58V/c/2E92','h3dI3Lro4l','2023-11-01 04:24:25','2023-11-01 05:44:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jjj','client'),(49,'vvv','vvv','vvv@njit.edu','$2b$10$1.feEb.XBP9CySwSCLmD5e6Yglzm0CqGI0XZMxsmFyZDY/uwPnzv.','bN(JFN*d@K','2023-11-01 05:13:05','2023-11-01 05:44:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'vvv','client'),(50,'tt','tt','tt@njit.edu','$2b$10$qoz20FQhtMqW7gabdK.Wn.XvX5jrz5V4QMho0MyNbDpOXeF/0kt1y','24YF3&TPUZ','2023-11-01 05:44:27','2023-11-01 05:44:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'tt','client'),(51,'jjj','jjj','jjj@njit.edu','$2b$10$EjXVwH3hXC/leEWTMs8F4Ot5.luFrtzEiK/cPigW4gk21tjpAw0kW','Zez$z@KOu5','2023-11-01 05:46:06','2023-11-01 05:46:12',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jjjax','client'),(52,'aasdfasdf','asdfasdfasdf','asdfasdf@njit.edu','$2b$10$PRT.kPX8AeM7vCuMjYLh/ucIGp11ZLbva/bXZk/2xKjQAtfGPaFUu','@rWzkjNFBX','2023-11-02 10:02:17','2023-11-02 10:02:17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'aaaaaaaaaaaaaa','coach'),(53,'aasdfasdf','asdfasdfasdf','asdfasdf@njit.edu','$2b$10$Ir3.3tEioVbKT0NRuLDdEe8SjdGEsMNzwBjTMx9PfF/ZxrKzg/7ly','p7H%^)hSWT','2023-11-02 10:03:02','2023-11-02 10:03:02',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'aaaaaaaaaaaaaaasdf','coach'),(54,'asdfasdfa','asdcasdgadfg','sdfgsdfg@njit.edu','$2b$10$EJaCLNaBRJZwsEvuEaReUup.QPyjPaWVxMcS6WqPAcV542SZ9xs5u','2$8!dTiN5J','2023-11-02 10:03:53','2023-11-02 10:03:53',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bbbbbb','coach'),(55,'cvbxcvb','xcvbxcvb','xcvbxcvb@njit.edu','$2b$10$d48OB010Sf2ah5KgG/7Sfu6Gz7FHwNonL308IjLJ0RzViKzdiq0o.','CIPwl6$Obb','2023-11-02 10:05:29','2023-11-02 10:05:29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'xvbxcvb','coach'),(56,'cvbxcvb','xcvbxcvb','xcvbxcvb@njit.edu','$2b$10$6ZVV3x7ja9PCkjEBRFHRPuzEBt44Ujktcu4IuIAnMHgfxDSqy0Ie.','Ve%aiu%&^)','2023-11-02 10:05:48','2023-11-02 10:05:48',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'xvbxcvbxcvb','coach'),(57,'ghfjfghjfgh','fghjfghj','fghjfghj@njit.edu','$2b$10$1LRLorzyeiAIIKcdbvoTLeyVhawqE2VB6xzz5wENLdu.ZXyQTyfpK','A#fNvoh1#T','2023-11-02 10:06:11','2023-11-02 10:06:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'sdfgsdfg','coach'),(58,'wsdfgsdfg','vfssdfg','sdfbsdfb@njit.edu','$2b$10$sANyDmR6UkOaR.7eHcbKpezNI.GrlsvZ5x4s/05aD35PuzpvfjsHC','cmImx(cV@x','2023-11-02 10:06:37','2023-11-02 10:06:37',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'sdfgsdfgsdvf','coach'),(59,'asdfasdvasdf','vsgfdgsd','sdfbsdfbg@njit.edu','$2b$10$pkB2S1nWTiUHZpSFd4r6He8kB0PQVNlg8/nUhD/7m/YL7FrFeUugS','Y1c9GFxd^Y','2023-11-02 10:10:54','2023-11-02 10:10:54',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'sdfgsdfv','coach'),(60,'dfghdfgnd','mfghmf','fghmjf@njit.edu','$2b$10$am0QpfCnduNMYijnoBOahuUxuGUKAaziezcxxKBN0pLVjRdxGTFYu','E8^pCsfpnt','2023-11-02 10:14:44','2023-11-02 10:14:44',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'shsgh','coach'),(61,'gbsgb','vcbxcvb','fghmjf@njit.edu','$2b$10$koGmRmTE8LYzp9rjbiZkSOboOd0L4iDeqI6U/D3DbOrCn5NY9eG/i','LbuW2dIToR','2023-11-02 10:15:44','2023-11-02 10:15:44',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'asdfasdfasdf','client'),(62,'pokpok','pokpok','pokpok@njit.edu','$2b$10$xXW/D3aHui9WrguPCTEqOOEcRR8z4jkz0o9iOWUoEU2o7AiJ0cs4e','ecJtwLLzLi','2023-11-02 19:08:32','2023-11-02 19:08:32',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jlnkjlnkn','client'),(63,'pokpok','pokpok','pokpok@njit.edu','$2b$10$MPp3SDUFU9sW26jgK.LlT.dO150.DZjwxVsb756tqkSbr2du2umz.','r9bpuO9rhM','2023-11-02 19:09:49','2023-11-02 19:09:49',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jlnkjlnknlll','client'),(64,'oon','lkmklm','lkmlkm@njit.edu','$2b$10$FS4bqzjaKk5RJJvCOrJm/eSkrFoEHDzL3lS0UTwPMVmcPMxj2.8Sq','$f)ctPzTnP','2023-11-02 19:24:28','2023-11-02 19:24:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'iukbkkjnkj','client'),(65,'lknlkmlk','kljnkb','mnmnb@njit.edu','$2b$10$zb62sUkwIEc6ChNe8vnE0.vmYU7lr83tsELRNacrF7OUoH4PtqV8S','IuhqV&Uwh1','2023-11-02 19:26:05','2023-11-02 19:26:05',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jnkb','client'),(66,'pkmppm','pklmpmk','pmpmkp@njit.edu','$2b$10$dxUirpSb/8K2hgKJF1LbF.5AQ/CriIEJG6pRA.7ByPjcEM/PZzR2i','uj$Mub!Xs^','2023-11-02 19:27:23','2023-11-02 19:27:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'sfvsfvsfvkj','client'),(67,'pkmppmpl','pklmpmk','pmpmkp@njit.edu','$2b$10$BwWr2y3ywk.4PVmstToetekGgw4VoqU3y5/yKM2nfi4ZkJOIXKUaC','vML5$^sfd$','2023-11-02 19:28:32','2023-11-02 19:28:32',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'sfvsfvsfvkjpvc','client'),(68,'sdvfd','pkmkpm','pkmpkmp@njit.edu','$2b$10$YXdFXnyj3eNToNohNQWDJ.04aYybG.34VmGhWBkLxSZ7xJh8CqD2m','FenmsPchSF','2023-11-02 19:29:31','2023-11-02 19:29:31',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'skjfndfkjgn','client'),(69,'sdvfd','pkmkpm','pkmpkmp@njit.edu','$2b$10$dSA76QwOEnftzLoWr4F9Z.VF7KEXDom4PeohIojk.eyZudhhyT2b6','ovm2an)OR&','2023-11-02 19:30:09','2023-11-02 19:30:09',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'skjfndfkjgnkkk','client'),(70,'pkmkm','pkmpkm','pkmpkm@njit.edu','$2b$10$VDQmfNy4X/1VKoDhDRuyDux5QyCsKvWyJka93CoZhZnX.v.IKevvm','Y6ttwWnAX)','2023-11-02 19:31:18','2023-11-02 19:31:18',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'pojdfsbvpjosdfgn','client'),(71,'fvsfdvs','lkpmlkpm','pkmpkom@njit.edu','$2b$10$zXqtfZDWu0eoZVTybNqLYuSG5bsLMKXgU5/2lyXkM4Yu00WTJ8suu','hVv3%dXAZn','2023-11-02 19:32:08','2023-11-02 19:32:08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'pojknpokm','client'),(72,'lxmcvnxxv','zdxnbvzv','zxnvzc@njit.edu','$2b$10$A6EvHJeF5.YV2iAW8Wu.ReyTCqrvLjqrE7aHTJ.HFHz.y0mbdzQNC','nVe#5!Jsir','2023-11-02 19:33:52','2023-11-02 19:33:52',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'zcvzcvzcxvzcv','client'),(73,'sjdfnfjgs','kjdfvasdjkf','sdfojpvnf@njit.edu','$2b$10$931iCtvM5.ESRg/.pp1WAeWFvJ0.idDLnv1ZXu2b/SBKzBzPDjhU2','pGl6H$TCW5','2023-11-02 19:36:17','2023-11-02 19:36:17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'fspoufhspuo','client'),(74,'llll','lllll','lll@Njit.euu','$2b$10$jFQmmxhtVc5IJ2itLoWDFeqLPL5ZQC54p0rRCjPPd8PaNbWhrukq6','NJnzHOvgTf','2023-11-02 19:37:19','2023-11-02 19:37:19',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'lllllll','client'),(75,'pjsdfnap','sdpfjovnsdpjfvn','pojngrpojarn@njit.edu','$2b$10$I6Xcy0wFu4X7S4xlfKdfQuu/5qjt9I4Yg.LuKbxkwBUA03gFTpKkG','*ecRpgRjOK','2023-11-02 19:41:57','2023-11-02 19:41:57',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'posjfgnsopjsodfns','client'),(76,'vvvvvvvv','vvvvvvvvvv','vvvvvv@njit.edu','$2b$10$fE//aJyZI55tk7yVrN7uCu0o1C/kz00VkXdMf9TgS2oiFOnHZirAW','Zd9*$xwyUK','2023-11-02 19:44:33','2023-11-02 19:44:33',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'vvvvvvvvvvvv','client'),(77,'savasfd','fdsvsdfg','fsgdf@njit.edu','$2b$10$OfYsJqA1b1P3vBrz/pdUS.LLpq/L6n4LWstWUoD8F2FULcQUqDfHC','UWo76CyAhp','2023-11-02 19:45:25','2023-11-02 19:45:25',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'oijoipjpoij','client'),(78,'sfgs','sfgs','sfdgs@njit.edu','$2b$10$otlXdar.DaMdXOTqaHHPcOgpvEOCbHPIWszcbQH3p.7n9cXvd3sLm','n!KB$uuiij','2023-11-02 20:18:31','2023-11-02 20:18:31',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'sfgs','client'),(79,'sfs','sfsg','sfsd@njit.edu','$2b$10$/m7yKA1E99bczIJBvIqinu.lxBqUlDBVxnpOlCm5h1iS7Z0BOt5mq','4T(atEnj0j','2023-11-02 20:21:09','2023-11-02 20:21:09',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'sfgsfgsss','client'),(80,'ddddddddddd','dddddddddd','dddd@njit.edu','$2b$10$FMascAq/IcvNsHxjwEQGMOGEjxATE3Mp677DOTyGvTDXpSgReuHVe','&JmBNJtsHC','2023-11-02 20:23:10','2023-11-02 20:23:10',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ddddddd','client'),(81,'fths','sdgsd','dfsdfg@njit.edu','$2b$10$mEr8/4f50b8xeKg28JzsOeJcbsPtZvTN01cRR.xtVhfPCf85jz6v6','A&oa2OC*qm','2023-11-02 20:26:58','2023-11-02 20:26:58',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'sdfgsd','client'),(82,'zxvzxcv','zxcvzxcv','zxvzx@njit.edu','$2b$10$wlXAm/ASbXudJWne230jru/gR/Ztg0J6sr3hCoDTX21t3Ylrg8WHu','q$DSfpr%#5','2023-11-02 20:29:03','2023-11-02 20:29:03',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'zxvzcv','client'),(83,'sfgs','sdfgs','dsfgsdg@njit.edu','$2b$10$YFw.JTk7I4ZnbZLH3QYDCuGXDpVbHSxUEfovhCiPeQ6v4AUK/5/wC','vuPB1HV2La','2023-11-02 20:30:20','2023-11-02 20:30:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'fss','client'),(84,'sfgsf','sdfgs','dfgdg@njit.edu','$2b$10$bK1NiLkbLQpGTB6/c5XBsu6mwv0f7grPabyeiCQHlrLmeNsY3DTqG','fo5ORgsYTZ','2023-11-02 20:35:01','2023-11-02 20:35:01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'sdfsdf','client'),(85,'xsdfgs','vcgsdg','sdfg@njit.edu','$2b$10$mtB3gbjBXHfpne5UR.e9u.xZ23zntraLMQACn/D2/xJgYGUlt3YSa','ai*PO@Vugy','2023-11-02 20:36:25','2023-11-02 20:36:25',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'onewet','client');
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

-- Dump completed on 2023-11-02 16:38:52

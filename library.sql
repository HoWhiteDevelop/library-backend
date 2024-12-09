-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: library
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `isbn` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` float NOT NULL,
  `publishDate` date NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_bd183604b9c828c0bdd92cafab` (`isbn`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book`
--

LOCK TABLES `book` WRITE;
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` VALUES (1,'深入理解计算机系统','Randal E. Bryant','9787111544937','计算机科学经典著作，深入讲解计算机系统的基本概念和原理',139,'2016-11-01','borrowed'),(2,'算法导论','Thomas H. Cormen','9787111407010','算法领域的经典教材，全面介绍算法设计与分析',128,'2013-01-01','borrowed'),(3,'JavaScript高级程序设计','Nicholas C. Zakas','9787115545381','JavaScript红宝书，Web开发必读经典',119,'2019-12-01','borrowed'),(4,'深入理解Java虚拟机','周志明','9787111641247','详细讲解JVM原理和调优技巧',129,'2019-12-01','borrowed'),(5,'Redis设计与实现','黄健宏','9787111464747','Redis源码剖析与实现原理详解',79,'2014-06-01','borrowed'),(6,'百年孤独','加西亚·马尔克斯','9787544253994','魔幻现实主义文学代表作',55,'2011-06-01','available'),(7,'三体','刘慈欣','9787229030933','中国科幻文学代表作，雨果奖获奖作品',48,'2008-01-01','borrowed'),(8,'人类简史','尤瓦尔·赫拉利','9787508647357','从生物学角度回顾人类历史',68,'2014-11-01','borrowed'),(9,'解忧杂货店','东野圭吾','9787544270878','温暖人心的治愈系小说',39.5,'2014-05-01','available'),(10,'活着','余华','9787506365437','中国当代文学经典作品',35,'2012-08-01','available'),(11,'原则','瑞·达利欧','9787508684031','桥水基金创始人的思想精髓',98,'2018-01-01','available'),(12,'穷查理宝典','彼得·考夫曼','9787508663326','查理·芒格的投资智慧',88,'2016-01-01','available'),(13,'零售的哲学','永野大辅','9787521719712','无印良品前董事长的经营理念',58,'2020-01-01','borrowed'),(14,'定位','艾·里斯','9787547307618','市场营销经典著作',45,'2011-01-01','available'),(15,'商业模式新生代','亚历山大·奥斯特瓦德','9787111407980','商业模式创新指南',69,'2013-06-01','available'),(16,'未来简史','尤瓦尔·赫拉利','9787508672069','关于人类未来的深度思考',98,'2017-01-01','available'),(17,'时间简史','史蒂芬·霍金','9787535732309','探索宇宙奥秘的科普经典',45,'2010-01-01','available'),(18,'生命3.0','迈克斯·泰格马克','9787508698670','人工智能时代的人类生存',88,'2017-11-01','borrowed'),(19,'必然','凯文·凯利','9787213061851','科技趋势预测',79,'2016-01-01','available'),(20,'奇点临近','雷·库兹韦尔','9787121139512','探讨技术奇点和人类未来',99,'2011-01-01','available'),(21,'学习之道','芭芭拉·奥克利','9787115473288','学习方法和技巧指南',59,'2017-01-01','available'),(22,'刻意练习','安德斯·艾利克森','9787111564829','精英的训练法则',68,'2016-11-01','available'),(23,'认知天性','彼得·布朗','9787115429476','关于学习的科学',79,'2015-06-01','borrowed'),(24,'教育的本质','约翰·杜威','9787303236879','现代教育理论基础',49,'2016-01-01','available'),(25,'给教师的建议','苏霍姆林斯基','9787107287121','教育实践指导',39,'2013-01-01','available');
/*!40000 ALTER TABLE `book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_loan`
--

DROP TABLE IF EXISTS `book_loan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_loan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `bookId` int NOT NULL,
  `loanDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `returnDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_bc4aa390b0ffd47ea814ff6a8d4` (`userId`),
  KEY `FK_9749139ab1fb4791fa186082516` (`bookId`),
  CONSTRAINT `FK_9749139ab1fb4791fa186082516` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`),
  CONSTRAINT `FK_bc4aa390b0ffd47ea814ff6a8d4` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_loan`
--

LOCK TABLES `book_loan` WRITE;
/*!40000 ALTER TABLE `book_loan` DISABLE KEYS */;
INSERT INTO `book_loan` VALUES (4,1,1,'2024-12-03 15:51:54',NULL),(5,1,3,'2024-12-03 16:31:42',NULL),(6,4,8,'2024-12-03 20:55:02',NULL),(7,4,5,'2024-12-06 00:16:25',NULL);
/*!40000 ALTER TABLE `book_loan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_recommendation`
--

DROP TABLE IF EXISTS `book_recommendation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_recommendation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(100) DEFAULT NULL,
  `isbn` varchar(13) DEFAULT NULL,
  `description` text,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `book_recommendation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_recommendation`
--

LOCK TABLES `book_recommendation` WRITE;
/*!40000 ALTER TABLE `book_recommendation` DISABLE KEYS */;
INSERT INTO `book_recommendation` VALUES (1,2,'Python编程：从入门到实践','Eric Matthes','9787115428028','适合Python初学者的实用指南','pending','2024-12-02 13:14:26','2024-12-02 13:14:26'),(2,3,'深入理解计算机系统','Randal E. Bryant','9787111321330','计算机系统底层原理详解','approved','2024-12-02 13:14:26','2024-12-02 13:14:26');
/*!40000 ALTER TABLE `book_recommendation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','$2a$10$.rhJxfIYhA1DQRC1ldP1qePUn/kT5hxscs5yTtppx/I1a3GGINWrW','admin'),(2,'reader1','$2a$10$FQI6/gr9zvBcy2pcbXKZxuXTwNT99nfwh4RKgdWwZw.9vQa3HtEQm','reader'),(3,'reader2','$2a$10$UxaxRj.r8ALyxYVVCB4GiONf/pF5BLHvyK45POMrNAVnbmYk6bB66','reader'),(4,'HoWhite','$2a$10$p5.GmYFIChuvZSeb4oboouwX2nSO/D/yLO9gj8C/ULl/X2/bqKusm','admin');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-09 18:37:23

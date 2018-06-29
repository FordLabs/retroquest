CREATE TABLE IF NOT EXISTS `thought` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `discussed` bit(1) NOT NULL,
  `hearts` int(11) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `team_id` varchar(255) DEFAULT NULL,
  `topic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
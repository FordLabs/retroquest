CREATE TABLE IF NOT EXISTS `column_title` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `topic` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `team_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
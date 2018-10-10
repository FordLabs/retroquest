CREATE TABLE IF NOT EXISTS `board` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date_created` DATE,
  `team_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
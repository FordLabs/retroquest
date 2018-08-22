CREATE TABLE IF NOT EXISTS `action_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `assignee` varchar(255) DEFAULT NULL,
  `completed` bit(1) NOT NULL,
  `task` varchar(255) DEFAULT NULL,
  `team_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `feedback` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `comment` varchar(3000) DEFAULT NULL,
  `date_created` varbinary,
  `stars` int(11) NOT NULL,
  `team_id` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `team` (
  `uri` varchar(255) NOT NULL,
  `date_created` varbinary,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `failed_attempts` int,
  `last_login_date` varbinary,
  PRIMARY KEY (`uri`)
);

CREATE TABLE IF NOT EXISTS `thought` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `discussed` bit(1) NOT NULL,
  `hearts` int(11) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `team_id` varchar(255) DEFAULT NULL,
  `topic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `column_title` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `topic` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `team_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO column_title (team_id, topic, title)
SELECT uri, 'happy', 'Happy' FROM team;

INSERT INTO column_title (team_id, topic, title)
SELECT uri, 'confused', 'Confused' FROM team;

INSERT INTO column_title (team_id, topic, title)
SELECT uri, 'unhappy', 'Sad' FROM team;
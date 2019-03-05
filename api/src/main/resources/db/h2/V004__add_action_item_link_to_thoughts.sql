CREATE TABLE IF NOT EXISTS `action_thought_link` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `thought_id` bigint(20) NOT NULL,
  `action_item_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `action_thought_map` (
  `thought_id` bigint(20) NOT NULL,
  `action_item_id` bigint(20) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  FOREIGN KEY (thought_id) REFERENCES thought(id) ON DELETE CASCADE,
  FOREIGN KEY (action_item_id) REFERENCES action_item(id) ON DELETE CASCADE
);
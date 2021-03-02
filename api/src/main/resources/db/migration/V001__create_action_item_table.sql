CREATE TABLE IF NOT EXISTS action_item (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  assignee varchar(255) DEFAULT NULL,
  completed bit(1) NOT NULL,
  task varchar(255) DEFAULT NULL,
  team_id varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);
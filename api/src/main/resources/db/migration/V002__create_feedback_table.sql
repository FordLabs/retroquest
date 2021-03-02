CREATE TABLE IF NOT EXISTS feedback (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  comment varchar(3000) DEFAULT NULL,
  date_created tinyblob,
  stars int(11) NOT NULL,
  team_id varchar(255) DEFAULT NULL,
  user_email varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);
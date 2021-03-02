CREATE TABLE IF NOT EXISTS team (
  uri varchar(255) NOT NULL,
  date_created tinyblob,
  name varchar(255) DEFAULT NULL,
  password varchar(255) DEFAULT NULL,
  PRIMARY KEY (uri)
);
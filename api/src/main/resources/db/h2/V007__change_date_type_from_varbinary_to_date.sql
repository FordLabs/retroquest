ALTER TABLE `board`
 ALTER COLUMN `date_created` DATE;

ALTER TABLE `feedback`
 ALTER COLUMN `date_created` TIMESTAMP;

ALTER TABLE `team`
 ALTER COLUMN `date_created` DATE;

ALTER TABLE `team`
 ALTER COLUMN `last_login_date` DATE;
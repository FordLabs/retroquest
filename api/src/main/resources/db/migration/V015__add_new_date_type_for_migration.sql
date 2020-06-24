ALTER TABLE `board`
 ADD COLUMN `date_created2` DATE;

ALTER TABLE `feedback`
 ADD COLUMN `date_created2` TIMESTAMP;

ALTER TABLE `team`
 ADD COLUMN `date_created2` DATE;

ALTER TABLE `team`
 ADD COLUMN `last_login_date2` DATE;
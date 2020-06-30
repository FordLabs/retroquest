ALTER TABLE `board`
 DROP COLUMN `date_created`;

ALTER TABLE `board`
 ALTER COLUMN `date_created2` RENAME TO `date_created`;

ALTER TABLE `feedback`
 DROP COLUMN `date_created`;

ALTER TABLE `feedback`
 ALTER COLUMN `date_created2` RENAME TO `date_created`;

ALTER TABLE `team`
 DROP COLUMN `date_created`;

ALTER TABLE `team`
 ALTER COLUMN `date_created2` RENAME TO `date_created`;

ALTER TABLE `team`
 DROP COLUMN `last_login_date`;

ALTER TABLE `team`
 ALTER COLUMN `last_login_date2` RENAME TO `last_login_date`;
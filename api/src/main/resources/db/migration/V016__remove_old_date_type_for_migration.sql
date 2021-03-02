ALTER TABLE board
 DROP COLUMN date_created;

ALTER TABLE board
 CHANGE date_created2 date_created DATE;

ALTER TABLE feedback
 DROP COLUMN date_created;

ALTER TABLE feedback
 CHANGE date_created2 date_created TIMESTAMP;

ALTER TABLE team
 DROP COLUMN date_created;

ALTER TABLE team
 CHANGE date_created2 date_created DATE;

ALTER TABLE team
 DROP COLUMN last_login_date;

ALTER TABLE team
 CHANGE last_login_date2 last_login_date DATE;
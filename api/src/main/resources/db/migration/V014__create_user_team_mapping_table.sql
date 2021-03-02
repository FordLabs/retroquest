CREATE TABLE IF NOT EXISTS user_team_mapping
(
    id       bigint(20)   NOT NULL AUTO_INCREMENT,
    user_id  bigint(20)   NOT NULL,
    team_uri varchar(255) NOT NULL,
    PRIMARY KEY (id)
);
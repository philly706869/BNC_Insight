CREATE DATABASE IF NOT EXISTS NEWS;
USE NEWS;
CREATE TABLE USER(
    `ID` VARCHAR(32) PRIMARY KEY,
    `PASSWORD_HASH` BINARY(60) NOT NULL,
    `NAME` VARCHAR(32) NOT NULL,
    `AUTH_TOKEN` VARCHAR(64) NOT NULL,
    `AUTH_TOKEN_ISSUE_DATE` TIMESTAMP NOT NULL,
)
CREATE TABLE AUTH_TOKEN(
    `TOKEN` VARCHAR(64) NOT NULL,
    `ISSUE_DATE` TIMESTAMP NOT NULL,
    `EXPIRATION_PERIOD` TIMESTAMP NOT NULL,
)
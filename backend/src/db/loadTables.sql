DO $$
BEGIN

/* Create auth table */
CREATE TABLE IF NOT EXISTS auth (
    id SERIAL PRIMARY KEY,
    userId int NOT NULL,
    refreshToken varchar NOT NULL
);

/* Create user table */
CREATE TABLE IF NOT EXISTS sys_user (
    id SERIAL PRIMARY KEY,
    username varchar NOT NULL,
    password varchar NOT NULL,
    email varchar NOT NULL,
    apiKey varchar NOT NULL,
    profilePicture varchar
);

/* Create model table */
CREATE TABLE IF NOT EXISTS package (
    id SERIAL PRIMARY KEY,
    userId int NOT NULL,
    lastUpdated TIMESTAMP NOT NULL,
    numApiCalls int ,
    name varchar,
    category varchar,
    description varchar,
    input varchar,
    output varchar,
    markdown TEXT /* no size limit so need to check file size before insertion */
);

/* Create category table */
CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,
    name varchar NOT NULL,
    description varchar NOT NULL
);

/* Create Flag Table */
CREATE TABLE IF NOT EXISTS flag (
    id SERIAL PRIMARY KEY,
    name varchar NOT NULL,
    description varchar NOT NULL
);

/* Create package-flag table */
CREATE TABLE IF NOT EXISTS package_flag (
    id SERIAL PRIMARY KEY,
    packageId int NOT NULL,
    flagId int NOT NULL
);

/* Uncomment to delete all tables*/
/*
DROP TABLE auth;
DROP TABLE sys_user;
DROP TABLE package;
DROP TABLE category;
DROP TABLE flag;
DROP TABLE package_flag;
*/

END;
$$
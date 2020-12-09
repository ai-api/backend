/* \c database*/

/* Create auth table */
CREATE TABLE auth (
    id int NOT NULL PRIMARY KEY,
    userId int NOT NULL,
    refreshToken varchar NOT NULL
);

/* Create user table */
CREATE TABLE sys_user (
    id int NOT NULL PRIMARY KEY,
    username varchar NOT NULL,
    password varchar NOT NULL,
    email varchar NOT NULL,
    apiKey varchar NOT NULL,
    profilePicture bytea
);

/* Create model table */
CREATE TABLE package (
    id int NOT NULL PRIMARY KEY,
    userId int NOT NULL,
    lastUpdated DATE NOT NULL,
    numApiCalls int ,
    name varchar,
    category varchar,
    description varchar,
    input varchar,
    output varchar,
    markdown TEXT /* no size limit so need to check file size before insertion */
);

/* Create category table */
CREATE TABLE category (
    id int NOT NULL PRIMARY KEY,
    name varchar NOT NULL,
    description varchar NOT NULL
);

/* Create Flag Table */
CREATE TABLE flag (
    id int NOT NULL PRIMARY KEY,
    name varchar NOT NULL,
    description varchar NOT NULL
);

/* Create package-flag table */
CREATE TABLE package_flag (
    id int NOT NULL PRIMARY KEY,
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


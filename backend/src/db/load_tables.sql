/* \c database*/

/* Create user table */
CREATE TABLE sys_user (
    id int NOT NULL PRIMARY KEY,
    username varchar NOT NULL,
    email varchar NOT NULL,
    api_key varchar NOT NULL,
    profile_picture bytea
);

/* Create model table */
CREATE TABLE model (
    id int NOT NULL PRIMARY KEY,
    user_id int NOT NULL,
    last_updated DATE NOT NULL,
    num_api_calls int 
);

/* Create docs table */
CREATE TABLE doc (
    id int NOT NULL PRIMARY KEY,
    model_name varchar,
    model_id int,
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

/* Create doc-flag table */
CREATE TABLE doc_flag (
    id int NOT NULL PRIMARY KEY,
    doc_id int NOT NULL,
    flag_id int NOT NULL
);

/* Uncomment to delete all tables*/
/*
DROP TABLE sys_user;
DROP TABLE model;
DROP TABLE doc;
DROP TABLE category;
DROP TABLE flag;
DROP TABLE doc_flag;
*/

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

IF NOT EXISTS (
   SELECT 1
   FROM   information_schema.tables 
   WHERE  table_schema = 'public'   
   AND    table_name = 'category') THEN

    /* Create Category Table */
    CREATE TABLE category (
        id SERIAL PRIMARY KEY,
        name varchar NOT NULL,
        description varchar
    );

    INSERT INTO category(name, description) VALUES ('image', '');
    INSERT INTO category(name, description) VALUES ('text', '');
    INSERT INTO category(name, description) VALUES ('video', '');
    INSERT INTO category(name, description) VALUES ('audio', '');
END IF;

IF NOT EXISTS (
   SELECT 1
   FROM   information_schema.tables 
   WHERE  table_schema = 'public'   
   AND    table_name = 'flag') THEN

    /* Create Flag Table */
    CREATE TABLE flag (
        id SERIAL PRIMARY KEY,
        name varchar NOT NULL,
        description varchar
    );

    INSERT INTO flag(name, description) VALUES ('embedding', '');
    INSERT INTO flag(name, description) VALUES ('language', '');
    INSERT INTO flag(name, description) VALUES ('generation', '');
    INSERT INTO flag(name, description) VALUES ('text retrieval', '');
    INSERT INTO flag(name, description) VALUES ('question answering', '');
    INSERT INTO flag(name, description) VALUES ('classification', '');
    INSERT INTO flag(name, description) VALUES ('feature vector', '');
    INSERT INTO flag(name, description) VALUES ('object detection', '');
    INSERT INTO flag(name, description) VALUES ('segmentation', '');
    INSERT INTO flag(name, description) VALUES ('generator', '');
    INSERT INTO flag(name, description) VALUES ('pose detection', '');
    INSERT INTO flag(name, description) VALUES ('rnn agent', '');
    INSERT INTO flag(name, description) VALUES ('augmentation', '');
    INSERT INTO flag(name, description) VALUES ('style transfer', '');
    INSERT INTO flag(name, description) VALUES ('resolution', '');
    INSERT INTO flag(name, description) VALUES ('estimation', '');
    INSERT INTO flag(name, description) VALUES ('command detection', '');
    INSERT INTO flag(name, description) VALUES ('pitch extraction', '');
    INSERT INTO flag(name, description) VALUES ('event classification', '');
    INSERT INTO flag(name, description) VALUES ('other', '');
END IF;

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
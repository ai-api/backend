"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const pg_1 = require("pg");
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config/config"));
const body_parser_1 = __importDefault(require("body-parser"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const packagesRoute_1 = __importDefault(require("./routes/packagesRoute"));
const dbTestRoute_1 = __importDefault(require("./routes/dbTestRoute"));
const authMiddleware_1 = __importDefault(require("./middleware/authMiddleware"));
const jsonMiddleware_1 = __importDefault(require("./middleware/jsonMiddleware"));
///////////////////////////////////////////////////////////////////////////
//////////////////////////////// MIDDLEWARE ///////////////////////////////
///////////////////////////////////////////////////////////////////////////
/* Init express */
const app = express_1.default();
/* bodyParser is req'd to process json body */
app.use(body_parser_1.default.json());
/* Add auth middleware */
app.use(jsonMiddleware_1.default);
/* Add json middleware */
app.use(authMiddleware_1.default);
/* Add all routers to app */
app.use('/auth', authRoute_1.default);
app.use('/users/', usersRoute_1.default);
app.use('/packages/', packagesRoute_1.default);
/* Used to debug/test database operations */
app.use('/dbTest/', dbTestRoute_1.default);
/**
 * For some reason you need to add errors() after you add all of
 * the routes, otherwise it doesn't work
 */
app.use(celebrate_1.errors());
///////////////////////////////////////////////////////////////////////////
///////////////////////////////// DATABASE ////////////////////////////////
///////////////////////////////////////////////////////////////////////////
/* Create and connect to postgres client*/
const client = new pg_1.Client({
    user: config_1.default.db.username,
    host: config_1.default.db.ip,
    database: config_1.default.db.name,
    password: config_1.default.db.password,
    port: config_1.default.db.port
});
/* Connect to postgres client */
client.connect()
    .catch((err) => {
    console.log('ERROR: Could not connect to database!');
    console.log(err);
});
/* Run SQL script to initialize database tables */
const initDbSql = fs_1.default.readFileSync('src/db/loadTables.sql').toString();
client.query(initDbSql, function (err) {
    if (err)
        console.log('ERROR: Could not successfully load tables', err);
});
///////////////////////////////////////////////////////////////////////////
////////////////////////////// EXPRESS CONFIG /////////////////////////////
///////////////////////////////////////////////////////////////////////////
app.listen(config_1.default.port, () => {
    console.log('AI API listening on port ' + config_1.default.port);
});

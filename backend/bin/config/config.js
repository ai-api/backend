"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
/* Read the .env from the root directory of the git */
dotenv.config({ path: __dirname + '/../../../.env' });
var dev = {
    'port': '8000',
    'db': {
        'name': process.env.DB_NAME || 'config error',
        'username': process.env.DB_USERNAME || 'config error',
        'password': process.env.DB_PASSWORD || 'config error',
        'port': process.env.DB_PORT_EXTERNAL || 'config error'
    }
};
var prod = {
    'port': '80',
    'db': {
        'name': process.env.DB_NAME || 'config error',
        'username': process.env.DB_USERNAME || 'config error',
        'password': process.env.DB_PASSWORD || 'config error',
        'port': process.env.DB_PORT_INTERNAL || 'config error'
    }
};
/**
 * In package.json, I set the environment variable @NODE_ENV
 * to be 'prod' when 'yarn start' is called, and to be 'dev'
 * when 'yarn dev'
 */
exports.default = process.env.NODE_ENV == 'prod' ? prod : dev;

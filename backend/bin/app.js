"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * We can use import statements
 * now
 */
var express_1 = __importDefault(require("express"));
var config_1 = __importDefault(require("./config/config"));
var app = express_1.default();
console.log(config_1.default);
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen();

const express = require('express');
const logger = require('morgan');
require('dotenv').config({ path: `${__dirname}/../.env` });

const usersRouter = require('./routes/users');
const verifyController = require('./verify/verify.controller');
require('./db/db');

const app = express();

console.log('running server on 3005');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', usersRouter);
app.get('/verify/:token', verifyController.verifyUser);

module.exports = app;

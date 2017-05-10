'use strict';

let hapi = require('hapi');
let redis = require('redis');
let mongoose = require('mongoose');
let winston = require('winston');

let server = new hapi.Server();
let Schema = mongoose.Schema;
var redisClient = null;

let APP_HOST = 'localhost';
let APP_PORT = 3000;
let REDIS_HOST = 'localhost';
let REDIS_PORT = 6379;
let REDIS_PASSWORD = null;
let MONGO_URL = 'localhost/xxx';

let logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: 'filelog-info.log',
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: 'filelog-error.log',
            level: 'error'
        })
    ]
});

try {
    mongoose.connect('mongodb://' + MONGO_URL);
} catch (e) {
    logger.error('Error with connection to Mongo');
    return;
}

try {
    redisClient = redis.createClient({host: REDIS_HOST, port: REDIS_PORT});
    // if there is a password to connect to Redis
    if (REDIS_PASSWORD) {
        redisClient.auth(REDIS_PASSWORD, function (error, reply) {
            if (error) {
                logger.error('Error authenticating to Redis');
            }
        });
    }
    // stop execution if there is an error connecting to redis.
    redisClient.on('error', function () {
        logger.error('Error with connection to Redis');
        return;
    });
} catch (e) {
    logger.error('Error with connection to Redis');
    return;
}

server.connection({
    host: APP_HOST,
    port: process.env.PORT || APP_PORT || 3000
});

server.route(require('./routes.js'));
server.start();
logger.info('Server is running under ' + APP_HOST + ':' + APP_PORT);
const redis = require('redis');
require('dotenv').config();
const redisClient = redis.createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redisClient.on('error', (err) => console.error('Redis error : ', err));
redisClient.on('connect', () => console.log('Redis connected'));

redisClient.connect().catch(err => console.error('Redis connection error : ', err));

const getCache = (key, callback) => {
    redisClient.get(key, (err, result) => {
        if (err) {
            return callback(err, null);
        }
        return callback(null, result);
    });
}

const setCache = (key, value, expiration = 3600) => {
    redisClient.set(key, value, 'EX', expiration);
};

const deleteCache = (key) => {
    redisClient.del(key);
}

const getAll = (callback) => {
    redisClient.keys('*', (err, keys) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, keys);
    });
};

const deleteAll = () => {
    redisClient.flushall();
};

module.exports = {
    getCache,
    setCache,
    deleteCache,
    getAll,
    deleteAll
};
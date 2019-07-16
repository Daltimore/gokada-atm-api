const path = require('path');
const util = require('util');

const development = require('./env/development');
const test = require('./env/test');
const production = require('./env/production');

const extend = (util)._extend;
const defaults = {
    root: path.normalize(`${__dirname}/..`),
    serviceName: 'ATM Service',
    auth: {
        issuer: 'Gokada',
        subject: 'SessionToken',
        audience: 'http://www.gokada.com',
        expiresIn: '2h'
    }
};

const environment = {
    development: extend(development, defaults),
    test: extend(test, defaults),
    production: extend(production, defaults)
}[process.env.NODE_ENV || 'development'];

module.exports = environment;

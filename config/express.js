const fs = require('fs');

const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const FileStreamRotator = require('file-stream-rotator');

const loggerInit = require('./logger');
const routes = require('../app/routes/index');
const config = require('../config');


const logDirectory = './log';
const checkLogDir = fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const expressConfig = (app) => {
    let accessLogStream,
        logger;

    if (app.get('env') === 'development') {
        logger = loggerInit('development');
    } else if (app.get('env') === 'production') {
        logger = loggerInit('production');
    } else if (app.get('env') === 'test') {
        logger = loggerInit('test');
    } else {
        logger = loggerInit();
    }

    global.logger = logger;
    logger.info('Application starting...');
    logger.debug("Overriding 'Express' logger");


    if (checkLogDir) {
        accessLogStream = FileStreamRotator.getStream({
            date_format: 'YYYYMMDD',
            filename: `${logDirectory}/server-%DATE%.log`,
            frequency: 'weekly',
            verbose: false
        });
    }

    app.use(session({
        secret: config.SESSION_SECRET_KEY,
        saveUninitialized: true,
        resave: true,
        cookie: {
            expires: 60000
        }
    }));

    app.use(morgan('combined', { stream: accessLogStream }));


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));


    app.use(helmet());
    app.disable('x-powered-by');


    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });


    app.use('/', routes);


    app.use((next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });


    if (app.get('env') === 'development' || app.get('env') === 'test') {
        app.use((err, res) =>
            res.status(err.status || 500)
                .json({
                    message: err.message,
                    error: err
                }));
    }

    app.use((err, res) =>
        res.status(err.status || 500).json({ message: err.message }));
};

module.exports = expressConfig;

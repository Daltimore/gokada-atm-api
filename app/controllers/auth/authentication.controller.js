const Q = require('q');
const CheckRequestBody = require('../../utils/request.body.verifier');
const generateToken = require('../../utils/generate.token');
const config = require('../../../config');
const Response = require('../../utils/response');


const ResponseHandler = new Response();

const checkRequest = (body) => {
    const defer = Q.defer();
    const error = CheckRequestBody(body, [
        'card_number',
        'pin'
    ]);
    if (error) {
        console.log(error)
        defer.reject({
            code: 400,
            msg: error
        });
    } else {
        defer.resolve(true);
    }
    return defer.promise;
};


const authenticateSession = (card_number, pin) => {
    const defer = Q.defer();
    if (pin === '1234') {
        const user = {
            account_number: '1234567890',
            account_name: 'Gokada Name',
            card_number
        };
        defer.resolve(user);
    } else {
        defer.reject({
            code: 400,
            msg: 'Invalid Pin. Please try again'
        });
    }
    return defer.promise;
};


const createUserToken = (user) => {
    const defer = Q.defer();
    generateToken(user)
        .then((token) => {
            const userDetails = {
                account_name: user.account_name
            };
            const data = {
                token,
                userDetails
            };
            defer.resolve(data);
        })
        .catch((e) => {
            logger.error('Generate-Token-Error', e, {
                serviceName: config.serviceName
            });
            defer.reject({
                code: 400,
                msg: 'Unknown Error.'
            });
        });
    return defer.promise;
};


async function startSession(req, res) {
    try {
        const { body } = req;
        const { card_number, pin } = body;
        await checkRequest(body);
        const user = await authenticateSession(card_number, pin);
        const response = await createUserToken(user);
        req.session.token = response.token;
        req.session.account_balance = 40000;
        res.status(200).json(ResponseHandler.success(req.originalUrl, {
            message: 'Session Started',
            session_data: response.userDetails
        }));
    } catch (e) {
        res.status(e.code).json(ResponseHandler.error(
            req.originalUrl,
            e.msg,
            'Bad Request'
        ));
    }
}

module.exports = startSession;


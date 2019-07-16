const Q = require('q');
const Response = require('../../utils/response');


const ResponseHandler = new Response();


const getBalance = (user, session) => {
    const defer = Q.defer();
    const data = {
        account_balance: session.account_balance,
        book_balance: session.account_balance,
        account_number: user.account_number,
        account_name: user.account_name
    };
    defer.resolve(data);
    return defer.promise;
};


async function getAccountBalance(req, res) {
    try {
        const { user, session } = req;
        const response = await getBalance(user, session);
        res.status(200).json(ResponseHandler.success(req.originalUrl, {
            message: 'User Account Balance',
            account_data: response
        }));
    } catch (e) {
        res.status(e.code).json(ResponseHandler.error(
            req.originalUrl,
            e.msg,
            'Bad Request'
        ));
    }
}

module.exports = getAccountBalance;


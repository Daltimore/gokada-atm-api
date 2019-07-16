const Q = require('q');
const moment = require('moment');
const Response = require('../../utils/response');
const CheckRequestBody = require('../../utils/request.body.verifier');


const ResponseHandler = new Response();


const checkRequest = (body) => {
    const defer = Q.defer();
    const error = CheckRequestBody(body, [
        'amount',
        'notes'
    ]);
    if (error) {
        defer.reject({
            code: 400,
            msg: error
        });
    } else {
        defer.resolve(true);
    }
    return defer.promise;
};


const validateAccountBalance = (amount, session) => {
    const defer = Q.defer();
    const balance = session.account_balance;
    if (parseFloat(amount) > balance) {
        defer.reject({
            code: 400,
            msg: 'Insufficient funds'
        });
    } else {
        defer.resolve(true);
    }
    return defer.promise;
};


const checkNoteValidity = (notes) => {
    const defer = Q.defer();
    const notesList = [ 500, 1000 ];
    if (notesList.includes(parseFloat(notes))) {
        defer.resolve(true);
    } else {
        defer.reject({
            code: 400,
            msg: 'Please select either 500 or 1000 naira notes'
        });
    }
    return defer.promise;
};


const validateNoteMultiples = (amount, notes) => {
    const defer = Q.defer();
    const remainder = parseFloat(amount) % parseFloat(notes);
    const quotient = Math.floor(parseFloat(amount) / parseFloat(notes));
    if (remainder > 0) {
        defer.reject({
            code: 400,
            msg: `Please enter an amount in multiples of ${notes} naira notes`
        });
    } else if (quotient > 40) {
        defer.reject({
            code: 400,
            msg: 'This ATM cannot dispense more that 40 notes at a time'
        });
    } else {
        defer.resolve(quotient);
    }
    return defer.promise;
};


const updateAccountBalance = (amount, session) => {
    const defer = Q.defer();
    const { account_balance } = session;
    const new_balance = parseFloat(account_balance) - parseFloat(amount);
    const data = {
        old_balance: account_balance,
        new_balance
    };
    defer.resolve(data);
    return defer.promise;
};


const generateReceipt = (quotient, user, amount, old_balance, new_balance, notes) => {
    const defer = Q.defer();
    const data = {
        account_number: user.account_number,
        account_name: user.account_name,
        withdrawal_amount: parseFloat(amount),
        withdrawal_notes: parseFloat(notes),
        number_of_notes: parseFloat(quotient),
        old_balance,
        new_balance,
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HH:mm:ss'),
        atm_location: 'IKEGA GRA'
    };
    defer.resolve(data);
    return defer.promise;
};


async function accountWithdrawal(req, res) {
    try {
        const { user, body, session } = req;
        const { amount, notes } = body;
        await checkRequest(body);
        await checkNoteValidity(notes);
        await validateAccountBalance(amount, session);
        const quotient = await validateNoteMultiples(amount, notes);
        const transactionData = await updateAccountBalance(amount, session);
        const { old_balance, new_balance } = transactionData;
        req.session.account_balance = new_balance;
        const response = await generateReceipt(quotient, user, amount, old_balance, new_balance, notes);
        res.status(200).json(ResponseHandler.success(req.originalUrl, {
            message: 'Account Withdrawal',
            withdrawal_data: response
        }));
    } catch (e) {
        res.status(e.code).json(ResponseHandler.error(
            req.originalUrl,
            e.msg,
            'Bad Request'
        ));
    }
}

module.exports = accountWithdrawal;


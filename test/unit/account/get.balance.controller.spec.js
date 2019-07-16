const chai = require('chai');

const rewire = require('rewire');

const getAccountBalance = rewire('../../../app/controllers/account/get.balance.controller');

describe('it Tests the Get Account balance function', () => {
    it('Gets account balance', async() => {
        const user = {
            account_number: 1234567890,
            account_name: 'Unit Test'
        };
        const session = {
            account_balance: 40000
        };
        const getBalance = getAccountBalance.__get__('getBalance');
        const response = await getBalance(user, session);
        response.account_number.should.equal(1234567890);
        response.account_name.should.equal('Unit Test');
        response.account_balance.should.equal(40000);
    });
});

const chai = require('chai');

const rewire = require('rewire');

const accountWithdrawal = rewire('../../../app/controllers/account/withdrawal.controller.js');

const { expect } = chai;

describe('it Tests the Withdrawal function', () => {
    it('Test Check Request Method Should Fail', async() => {
        const body = {
        };
        const checkRequest = accountWithdrawal.__get__('checkRequest');
        await expect(checkRequest(body)).to.be.rejected;
    });


    it('Test Check Request Method', async() => {
        const user = {
            account_number: 1234567890,
            account_name: 'Unit Test'
        };
        const session = {
            account_balance: 40000
        };
        const body = {
            amount: 1000,
            notes: 100
        };
        const checkRequest = accountWithdrawal.__get__('checkRequest');
        const response = await checkRequest(body);
        response.should.equal(true);
    });

    it('Test Validate Account Balance to fail', async() => {
        const session = {
            account_balance: 40000
        };
        const amount = 100000;
        const validateAccountBalance = accountWithdrawal.__get__('validateAccountBalance');
        await expect(validateAccountBalance(amount, session)).to.be.rejected;
    });


    it('Test Validate Account Balance to pass', async() => {
        const session = {
            account_balance: 40000
        };
        const amount = 10000;
        const validateAccountBalance = accountWithdrawal.__get__('validateAccountBalance');
        const response = await validateAccountBalance(amount, session);
        response.should.equal(true);
    });

    it('Test Validate Notes to fail', async() => {
        const notes = 100;
        const checkNoteValidity = accountWithdrawal.__get__('checkNoteValidity');
        await expect(checkNoteValidity(notes)).to.be.rejected;
    });


    it('Test Validate Notes to pass', async() => {
        const notes = 1000;
        const checkNoteValidity = accountWithdrawal.__get__('checkNoteValidity');
        const response = await checkNoteValidity(notes);
        response.should.equal(true);
    });

    it('Test Validate Notes Multiples to fail', async() => {
        const notes = 1000;
        const amount = 2300;
        const validateNoteMultiples = accountWithdrawal.__get__('validateNoteMultiples');
        await expect(validateNoteMultiples(amount, notes)).to.be.rejected;
    });


    it('Test Validate Note Multiples to pass', async() => {
        const notes = 1000;
        const amount = 20000;
        const validateNoteMultiples = accountWithdrawal.__get__('validateNoteMultiples');
        const response = await validateNoteMultiples(amount, notes);
        response.should.equal(20);
    });

    it('Test Update Account Balance', async() => {
        const amount = 20000;
        const session = {
            account_balance: 40000
        };
        const updateAccountBalance = accountWithdrawal.__get__('updateAccountBalance');
        const response = await updateAccountBalance(amount, session);
        response.old_balance.should.equal(40000);
        response.new_balance.should.equal(20000);
    });


    it('Test Generate Receipt', async() => {
        const amount = 20000;
        const quotient = 20;
        const old_balance = 40000;
        const new_balance = 20000;
        const notes = 1000;
        const user = {
            account_number: 1234567890,
            account_name: 'Unit Test'
        };
        const generateReceipt = accountWithdrawal.__get__('generateReceipt');
        const response = await generateReceipt(
            quotient, user, amount,
            old_balance, new_balance, notes
        );
        response.old_balance.should.equal(40000);
        response.new_balance.should.equal(20000);
        response.withdrawal_notes.should.equal(1000);
        response.number_of_notes.should.equal(20);
    });
});

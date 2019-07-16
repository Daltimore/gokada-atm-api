const _ = require('lodash');

const checkRequestBody = (params, requiredFields) => {
    const errors = {};
    for (let i = 0; i < requiredFields.length; i++) {
        if (!params[requiredFields[i]]) { errors[requiredFields[i]] = 'is required'; }
    }
    if (_.isEmpty(errors)) {
        return null;
    }
    return errors;
};

module.exports = checkRequestBody;

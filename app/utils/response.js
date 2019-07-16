const _ = require('lodash');

class Response {
    constructor(domain) {
        this.domain = domain || 'https://domain.com';
    }

    success(path, data, status = 'success') {
        const current_url = `${this.domain}${path}`;

        if (_.isEmpty(data)) { return new Error('Error: Object (data) is required!'); }

        return {
            current_url,
            data,
            status
        };
    }

    error(path, message, type, status = 'error') {
        const current_url = `${this.domain}${path}`;

        if (!message) { return new Error('Error: Object (message) is required!'); }

        return {
            current_url,
            message,
            type,
            status
        };
    }
}

module.exports = Response;

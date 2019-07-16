const production = {
    PORT: process.env.PORT,
    SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY || 'wiufhanajdiwjqwidsqe'
};

module.exports = production;

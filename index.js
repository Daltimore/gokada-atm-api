const express = require('express');


const expressConfig = require('./config/express');

const port = process.env.PORT || 4000;
console.log(port)
const app = express();


app.use(express.static('public'));


expressConfig(app);

app.listen(port);
logger.info(`Server started on port ${port}`);

module.exports = app;

const winston = require('winston');
const express = require('express');
const app = express();
const path = require('path');

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/prod')(app);

const dir = path.join(process.cwd(), 'images');
app.use('/images', express.static(dir));

//Handle production
if(process.env.NODE_ENV === 'production'){
    //Static folder
    app.use(express.static(__dirname + '/public/'));
    //Handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 5000;
app.listen(port, () => winston.info(`Server started on port ${port}`));
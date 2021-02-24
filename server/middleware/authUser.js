const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next){
    const token = req.header('token');
    if(!token) return res.status(401).send('Zabranjen pristup');

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }catch(ex){
        res.status(400).send('Nepravilan token.');
    }
}

function authBodyToken(req, res, next){
    const token = req.body.headers.token;
    if(!token) return res.status(401).send('Zabranjen pristup');

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }catch(ex){
        res.status(400).send('Nepravilan token.');
    }
}

function authHeadersToken(req, res, next){
    const token = req.headers.token;
    if(!token) return res.status(401).send('Zabranjen pristup');

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }catch(ex){
        res.status(400).send('Nepravilan token.');
    }
}

module.exports.auth = auth;
module.exports.authBodyToken = authBodyToken
module.exports.authHeadersToken = authHeadersToken
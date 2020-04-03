const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        req.logged = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    if(!token){
        req.logged = false;
        return next();
    }

    let decodedToken;
    try{
        decodedToken = await jwt.verify(token, 'mysecretkey');
    } catch (err){
        console.log(err);
        req.logged = false;
        return next();
    }
    if(!decodedToken){
        req.logged = false;
        return next();
    }
    
    req.logged = true;
    req.userId = decodedToken.userId;
    next();
}
const jwt = require('jsonwebtoken');
const User = require('../resources/user/user.model');

exports.protect = async(req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.token){
        token = req.cookies.token;
    }
    if(!token){
        return res.status(400).send('Unauthorized');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACC_ACTIVATE);

        console.log(decoded);

        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        return res.status(400).send('Unauthorized');
    }
}
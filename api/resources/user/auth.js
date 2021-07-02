const jwt = require('jsonwebtoken');
const UserModel = require('./user.model');

exports.protect = async(req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.headers.authorization){
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.token){
        token = req.cookies.token;
    }
    if(!token){
        return res.status(401).send('Unauthorized');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACC_ACTIVATE);

        console.log(decoded);

        req.user = await UserModel.findById(decoded._id);

        next();
    } catch (error) {
        return res.status(401).send({"error":'Unauthorized'});
    }
}

exports.authorize = (...levels)=> {
    return (req,res,next)=>{
        if(!levels.includes(req.user.level)){
            return res.status(403).send({"error":'You dont have access to this content'});
        }
        next();
    }
}
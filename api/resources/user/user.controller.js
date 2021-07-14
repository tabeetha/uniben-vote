const bcriptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require('crypto');

const UserModel = require("./user.model");

module.exports = {
    async createUser(req,res){
        try {

            let data = req.body;

            if(!data.name) return res.status(400).send({"error":"Name is required"});
            if(!data.email) return res.status(400).send({"error":"Email is required"});
            if(!data.phonenumber) return res.status(400).send({"error":"Phone Number is required"});
            if(!data.matnumber) return res.status(400).send({"error":"Matriculation Number is required"});
            if(!data.department) return res.status(400).send({"error":"Department is required"});
            if(!data.faculty) return res.status(400).send({"error":"Faculty is required"});
            if(!data.password) return res.status(400).send({"error":"Password is required"});

            if(!data.email.toLowerCase().endsWith('uniben.edu')) return res.status(400).send({"error":"Email is not a valid UNIBEN email"});

            const user = await UserModel.findOne(({email:data.email.toLowerCase()}));

            if (user) return res.status(400).send({"error":"Email already in use"});

            if(data.password.length < 6)
                return res.status(400).send('Password length too short');

            const name = data.name;
            const email = data.email.toLowerCase();
            const phonenumber = data.phonenumber;
            const matnumber = data.matnumber;
            const faculty = data.faculty;
            const department = data.department;
            const password = data.password;
            
            var user = new UserModel();
                        user.name = name;
                        user.email = email;
                        user.phonenumber = phonenumber;
                        user.faculty = faculty;
                        user.matnumber = matnumber;
                        user.department = department;

                        //HASHING THE password with bcryptjs
                        const salt = await bcriptjs.genSalt(10);
                        const hashedPassword = await bcriptjs.hash(password,salt);
                        user.password = hashedPassword;

                        await user.save((err, docs)=>{
                            if (!err){
                                res.status(200).send({"success": "User Created"});
                            }
                            else{
                                res.status(400).send({"error":err});
                            }
                        });

            

        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async getSingleUser(req,res){
        try {
            UserModel.findOne(({_id:req.params.id}),(err,doc)=>{
                if(!err){
                    if(!doc)
                        return res.status(404).send({"error":'User not found'});

                    res.status(200).send(doc);
                }
                else{
                    res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async getAllUsers(req,res){
        try {
            const level = req.query.level;
            if(level){
                UserModel.find({level:level},(err,docs)=>{
                    if(!err){
                        return res.status(200).send(docs);
                    }
                    else{
                        return res.status(400).send({"error":err});
                    }
                });
            }
            else {
                UserModel.find((err,docs)=>{
                    if(!err){
                        return res.status(200).send(docs);
                    }
                    else{
                        return res.status(400).send({"error":err});
                    }
                });
            }
            
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async findAllUsersPaginate(req,res){
        try {
            const {page,perPage,sort,level} = req.query;
            let options = {}
            if (level){
                options = {
                    page: parseInt(page,10) || 1,
                    limit: parseInt(perPage,10) || 10,
                    level: level,
                    sort: {date: -1}
                }
            }
            else {
                options = {
                    page: parseInt(page,10) || 1,
                    limit: parseInt(perPage,10) || 10,
                    sort: {date: -1}
                }
            }
            
            await UserModel.paginate({},options,(err, docs)=>{
                if(!err){
                    if (docs) return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (e) {
            return res.status(400).send({"error":e});
        }
    },

    async deleteUser(req,res){
        try {
            const user = await UserModel.findOne(({_id:req.params.id}));
            if(!user) return res.status(200).send({"error": "user not found"});

            try {
                user.remove((err, docs)=>{
                    if (!err){
                        return res.status(200).send({"success": "user deleted"});
                    }
                    else{
                        return res.status(400).send({"error": err});
                    }
                });
            } catch (err) {
                return res.status(400).send({"error": err});
            }
        } catch (err) {
            return res.status(400).send({"error": err});
        }
    },

    async loginUser(req,res){
        try {
            let data = req.body;

            const email = data.email.toLowerCase();

            if(!email)
                return res.status(400).send({"error":'Email is required'});

            if(!data.password)
                return res.status(400).send({"error":'Password is required'});

            const user = await UserModel.findOne(({email:email}));

            if(!user)
                return res.status(400).send({"error":`Email or Password incorrect`});

            const password = await bcriptjs.compare(data.password,user.password);

            if (!password) return res.status(400).send({"error":`Email or Password incorrect`});

            sendTokenResponse(user,200,res);
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async updatePassword(req,res){
        try {
            let data = req.body;
            const id = req.params.id;

            if(!data.oldPassword) return res.status(400).send({"error":'Old Password is required'});

            if(!data.password) return res.status(400).send({"error":'New Password is required'});

            const user = await UserModel.findOne(({_id:id}));
            if(!user) return res.status(400).send({"error":`User does not exist`});

            const password = await bcriptjs.compare(data.oldPassword,user.password);

            if (!password) return res.status(400).send({"error":`The old password is incorrect`});

            const salt = await bcriptjs.genSalt(10);
            const hashedPassword = await bcriptjs.hash(data.password,salt);
            user.password = hashedPassword;
            await user.save(({_id:req.params.id}),(err, docs)=>{
                if (!err){
                    res.status(200).send({"success":"Password updated"});
                }
                else{
                    res.status(400).send({"err":err});
                }
            });

        } catch (err) {
            return res.status(400).send({"err":err});
        }
    },

    async logoutUser(req,res,next){
        res.cookie('token', 'none', {
            expiresIn: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });

        res.status(200).send({"success":"Logout Success"});
    },

    async forgotPassword(req,res){

        try {
            const user = await UserModel.findOne({email:req.body.email.toLowerCase()});

            if(!user){
                return res.status(404).send({"error":'User not found'});
            }

            const resetToken = user.getResetPasswordToken();

            user.save({validateBeforeSave: false});

            const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;

            const message = `You are receiving this email because you have requested to reset your password,
             please click this link ${resetUrl} to complete the reset process or ignore this if you didnt order it`;

            try {
                await emailPassword({
                    email: user.email,
                    subject: 'Password Reset',
                    message
                });

                return res.status(200).send({"success":"Email sent"});
            } catch (error) {
                user.resetPasswordToken = undefined;
                user.resetPassordExpire = undefined;

                user.save({validateBeforeSave: false});

                return res.status(400).send({"error":error});
            }

        } catch (err) {
            res.status(400).send({"error": err});
        }
    },

    async getMe(req,res,next){
        const user = await UserModel.findById(req.user.id);

        res.status(200).send(user);
    },

    async resetPassword(req,res){

        //HASHING THE password with bcryptjs
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

        const user = await UserModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user){
            return res.status(400).send({"error":'Expired or Invaild link'});
        }

        //HASHING THE password with bcryptjs
        const salt = await bcriptjs.genSalt(10);
        const hashedPassword = await bcriptjs.hash(req.body.password,salt);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPassordExpire = undefined;

        await user.save();

        res.status(200).send({"success":"password reset complete, login with your new password"});
    },

    async verifyUserToken(req,res){
        try {
            const token = req.params.id;
            if(token){
                jwt.verify(token, process.env.JWT_ACC_ACTIVATE,function(err,decodedToken){
                    if (err){
                        return res.status(400).send({"error":err});
                    }

                    const name = decodedToken.name;
                    const email = decodedToken.email;
                    const phonenumber = decodedToken.phonenumber;
                    const department = decodedToken.department;
                    const faculty = decodedToken.faculty;
                    const matnumber = decodedToken.matnumber;
                    const password = decodedToken.password;

                    async function creatThisUser(){
                        var user = new UserModel();
                        user.name = name;
                        user.email = email;
                        user.phonenumber = phonenumber;
                        user.faculty = faculty;
                        user.matnumber = matnumber;
                        user.department = department;

                        //HASHING THE password with bcryptjs
                        const salt = await bcriptjs.genSalt(10);
                        const hashedPassword = await bcriptjs.hash(password,salt);
                        user.password = hashedPassword;

                        await user.save((err, docs)=>{
                            if (!err){
                                res.status(200).render('pages/welcome',{title: process.env.EMAIL_SENDER});
                            }
                            else{
                                res.status(400).send({"error":err});
                            }
                        });
                    }
                    creatThisUser();
                });
            }
            else {
                console.log(token)
                return res.status(400).send({"error":"null token"});
            }

        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async getIdFromToken(req,res){
        try {
            const token = req.params.id;
            if(token){
                jwt.verify(token, process.env.AUTH_TOKEN_SECRET,function(err,decodedToken){
                    if (err){
                        return res.status(400).send({"error":err});
                    }
                    async function getId(params) {
                        const id = await decodedToken._id;

                        return res.status(200).send({"id":id});
                    }
                    getId();
                });
            }
            else {
                console.log(token)
                return res.status(400).send({"error":"null token"});
            }

        } catch (err) {
            res.status(400).send({"error":err});
        }
    }

}

const sendTokenResponse = (user,status,res)=>{
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() * 30 * 60 * 60 * 24 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res.status(status).cookie('token',token,options).send({token,"level":user.level});
};

const emailPassword = async (options) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
        tls:{
            rejectUnauthorized :false
        }
    });

    // send mail with defined transport object
    const message = {
        from: `${process.env.EMAIL_FROM} <${process.env.EMAIL_USER}>`, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        html: options.html

        //${token}
    };

    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);

}; 

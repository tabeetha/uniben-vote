const express = require('express');
const authController = require('../user/user.controller');
const { protect } = require('../user/auth');

const authRouter = express.Router();
module.exports = authRouter;

authRouter.route('/').get(protect,authController.getMe);
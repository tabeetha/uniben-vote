const express = require('express');
const userRouter  = require('./resources/user');
const authRouter  = require('./resources/auth');
const positionRouter  = require('./resources/position');
const candidateRouter  = require('./resources/candidate');
const voteRouter  = require('./resources/vote');

const restRouter = express.Router();

module.exports =  restRouter;

restRouter.use('/users', userRouter);
restRouter.use('/authenticate', authRouter);
restRouter.use('/positions', positionRouter);
restRouter.use('/candidates', candidateRouter);
restRouter.use('/votes', voteRouter);
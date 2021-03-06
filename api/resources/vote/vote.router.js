const express = require('express');
const voteController = require('./vote.controller');
const { protect, authorize } = require('../user/auth');

const voteRouter = express.Router();
module.exports = voteRouter;

voteRouter.route('/')
    .post(protect,voteController.registerVote)
    .get(voteController.getAllVotes);

voteRouter.route('/:id')
    .get(protect, voteController.getOneVote)
    .delete(protect, voteController.deleteVote);

voteRouter.route('/:positionId/:candidateId')
    .get(protect, voteController.getResult);

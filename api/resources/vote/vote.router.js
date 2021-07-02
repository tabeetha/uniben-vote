const express = require('express');
const voteController = require('./vote.controller');
const { protect, authorize } = require('../user/auth');

const voteRouter = express.Router();
module.exports = voteRouter;

voteRouter.route('/')
    .post(protect, authorize('admin'),voteController.registerVote)
    .get(voteController.getAllVotes);

voteRouter.route('/:id')
    .get(protect, voteController.getOneVote)
    .delete(protect, voteController.deleteVote);
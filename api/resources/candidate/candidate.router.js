const express = require('express');
const candidateController = require('./candidate.controller');
const { protect, authorize } = require('../user/auth');

const positionRouter = express.Router();
module.exports = positionRouter;

positionRouter.route('/')
    .post(protect, authorize('admin'),candidateController.registerCandidate)
    .get(candidateController.getAllCandidates);

positionRouter.route('/:id')
    .get(protect, candidateController.getOneCandidate)
    .delete(protect, candidateController.deleteCandidate);
const express = require('express');
const positionController = require('./position.controller');
const { protect, authorize } = require('../user/auth');

const positionRouter = express.Router();
module.exports = positionRouter;

positionRouter.route('/')
    .post(protect, authorize('admin'),positionController.createPosition)
    .get(positionController.getAllPositions);

positionRouter.route('/:id')
    .get(protect, positionController.getOnePosition)
    .delete(protect, positionController.deletePosition);
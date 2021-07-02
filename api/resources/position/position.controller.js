const url = require("url");
const path = require("path");
const cloudinary = require('../../../config/cloudinary');
const fs = require('fs');

const PositionModel = require("./position.model");

module.exports =  {
    async createPosition(req,res){
        try {
            let model = new PositionModel();

            if (!req.body.name)
                return res.status(400).send({"error":"Name is required"});

            const position = await PositionModel.findOne(({name:req.body.name}));

            if (position) return res.status(400).send({"error":"Position already registered"});

            model.name = req.body.name;

            await model.save((err, doc)=>{
                if (!err){
                    res.status(200).send({'success':'Position Created'});
                }
                else{
                    res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async getOnePosition(req,res){
        try {
            PositionModel.findOne(({_id : req.params.id}),(err, doc)=>{
                if(!err){
                    if (!doc)
                        return res.status(404).send({"error":"Position not found"});
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

    async getAllPositions(req,res){
        try {
            PositionModel.find((err, docs)=>{
                if(!err){
                    res.status(200).send(docs);
                }
                else{
                    res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async deletePosition(req,res){
        try {
            PositionModel.findOne(({_id: req.params.id}),(err, doc)=>{
                if(!err){
                    if (!doc)
                        return res.status(404).send({"error":"Position not found"});

                    doc.remove((err, docs)=>{
                        if (!err){
                            res.status(200).send({"success":"Position deleted"});
                        }
                        else{
                            res.status(400).send({"error":err});
                        }
                    });
                }
                else{
                    res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            res.status(400).send({"error":err});
        }
    }
}
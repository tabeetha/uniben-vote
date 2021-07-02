const CandidateModel = require("./candidate.model");

module.exports =  {
    async registerCandidate(req,res){
        try {
            let model = new CandidateModel();

            if (!req.body.positionId)
                return res.status(400).send({"error":"Position Id is required"});
            if (!req.body.userId)
                return res.status(400).send({"error":"User Id is required"});

            model.positionId = req.body.positionId;
            model.userId = req.body.userId;

            await model.save((err, doc)=>{
                if (!err){
                    res.status(200).send({'success':'Candidate Registered'});
                }
                else{
                    res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async getOneCandidate(req,res){
        try {
            CandidateModel.findOne(({_id : req.params.id}),(err, doc)=>{
                if(!err){
                    if (!doc)
                        return res.status(404).send({"error":"Candidate not found"});
                    res.status(200).send(doc);
                }
                else{
                    res.status(400).send({"error":err});
                }
            }).populate('positionId', 'name').populate('userId', '_id name matnumber phonenumber email department faculty');
        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async getAllCandidates(req,res){
        try {
            CandidateModel.find((err, docs)=>{
                if(!err){
                    res.status(200).send(docs);
                }
                else{
                    res.status(400).send({"error":err});
                }
            }).populate('positionId', 'name').populate('userId', '_id name matnumber phonenumber email department faculty');
        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async getPosCandidates(req,res){
        try {
            CandidateModel.find({positionId:req.params.positionId},(err, docs)=>{
                if(!err){
                    res.status(200).send(docs);
                }
                else{
                    res.status(400).send({"error":err});
                }
            }).populate('positionId', 'name').populate('userId', '_id name matnumber phonenumber email department faculty');
        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async deleteCandidate(req,res){
        try {
            CandidateModel.findOne(({_id: req.params.id}),(err, doc)=>{
                if(!err){
                    if (!doc)
                        return res.status(404).send({"error":"Candidate not found"});

                    doc.remove((err, docs)=>{
                        if (!err){
                            res.status(200).send({"success":"Candidate deleted"});
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
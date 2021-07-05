const CandidateModel = require("./candidate.model");
const VoteModel = require("../vote/vote.model");

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

            const position = await VoteModel.findOne(({positionId:req.body.positionId}));

            if (position) {
                for (let i=0; i<position.candidateId.length; i++){
                    if(position.candidateId[i] == req.body.userId) return res.status(400).send({"error":"Candidate already registered"});
                }

                position.positionId = req.body.positionId;
                position.candidateId.push(req.body.userId);

                await position.save((err, doc)=>{
                    if (err){
                        return res.status(400).send({"error":err});
                    }
                });
            }
            else {
                let voteModel = new VoteModel();
                voteModel.positionId = req.body.positionId;
                voteModel.candidateId.push(req.body.userId);

                console.log("working2");
                await voteModel.save((err, doc)=>{
                    if (err){
                        return res.status(400).send({"error":err});
                    }
                });
            }

            await model.save((err, doc)=>{
                if (!err){
                    return res.status(200).send({'success':'Candidate Registered'});
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async getOneCandidate(req,res){
        try {
            CandidateModel.findOne(({_id : req.params.id}),(err, doc)=>{
                if(!err){
                    if (!doc)
                        return res.status(404).send({"error":"Candidate not found"});
                    return res.status(200).send(doc);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            }).populate('positionId', 'name').populate('userId', '_id name matnumber phonenumber email department faculty');
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async getAllCandidates(req,res){
        try {
            CandidateModel.find((err, docs)=>{
                if(!err){
                    return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            }).populate('positionId', 'name').populate('userId', '_id name matnumber phonenumber email department faculty');
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async getPosCandidates(req,res){
        try {
            CandidateModel.find({positionId:req.params.positionId},(err, docs)=>{
                if(!err){
                    return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            }).populate('positionId', 'name').populate('userId', '_id name matnumber phonenumber email department faculty');
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async deleteCandidate(req,res){
        try {
            const candidate = await CandidateModel.findOne(({_id: req.params.id}));

            if(!candidate) return res.status(404).send({"error":"Candidate not found"});

            const position = await VoteModel.findOne(({positionId:req.body.positionId}));
            if(position) {
                for (let i=0; i<position.candidateId.length; i++){
                    if(position.candidateId[i] == candidate.userId) array.splice(position.candidateId[i], 1);
                }
            }
            candidate.remove((err, docs)=>{
                if (!err){
                    return res.status(200).send({"success":"Candidate deleted"});
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    }
}
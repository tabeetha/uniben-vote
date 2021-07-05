const VoteModel = require("./vote.model");
const CandidateModel = require("../candidate/candidate.model");

module.exports =  {
    async registerVote(req,res){
        try {
            let model = new VoteModel();

            if (!req.body.positionId)
                return res.status(400).send({"error":"Position Id is required"});
            if (!req.body.candidateId)
                return res.status(400).send({"error":"Candidate Id is required"});
            if (!req.body.voterId)
                return res.status(400).send({"error":"Voter Id is required"});

            const position = await VoteModel.findOne(({positionId:req.body.positionId}));

            if (position) {
                for (let i=0; i<position.voterId.length; i++){
                    console.log(position.voterId[i]);
                    console.log(req.body.voterId);
                    if(position.voterId[i] == req.body.voterId) return res.status(400).send({"error":"You have voted for this position"});
                }

                position.positionId = req.body.positionId;
                position.candidateId.push(req.body.candidateId);
                position.voterId.push(req.body.voterId);

                await position.save((err, doc)=>{
                    if (!err){
                        return res.status(200).send({'success':'Voted'});
                    }
                    else{
                        return res.status(400).send({"error":err});
                    }
                });
            }
            else {
                model.positionId = req.body.positionId;
                model.candidateId.push(req.body.candidateId);
                model.voterId.push(req.body.voterId);

                await model.save((err, doc)=>{
                    if (!err){
                        return res.status(200).send({'success':'Voted'});
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

    async getOneVote(req,res){
        try {
            VoteModel.findOne(({_id : req.params.id}),(err, doc)=>{
                if(!err){
                    if (!doc)
                        return res.status(404).send({"error":"Vote not found"});
                    res.status(200).send(doc);
                }
                else{
                    res.status(400).send({"error":err});
                }
            }).populate('positionId', 'name').populate('candidateId', '_id name matnumber phonenumber email department faculty').populate('voterId', '_id name matnumber phonenumber email department faculty');
        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async getAllVotes(req,res){
        try {
            VoteModel.find((err, docs)=>{
                if(!err){
                    // for(let k=0; k<docs.length; k++){
                    //     if(docs[k].candidateId) for(let i=0; i<docs[k].candidateId.length; i++){
                    //         for(let j=i+1; j<docs[k].candidateId.length; j++){
                    //             if(docs[k].candidateId[i]._id == docs[k].candidateId[j]._id) array.splice(docs[k].candidateId[i], 1);
                    //         }
                    //     }
                    // }
                    
                    return res.status(200).send(docs);
                }
                else{
                    res.status(400).send({"error":err});
                }
            }).populate('positionId', 'name').populate('candidateId', '_id name matnumber phonenumber email department faculty').populate('voterId', '_id name matnumber phonenumber email department faculty');
        } catch (err) {
            res.status(400).send({"error":err});
        }
    },

    async getResult(req,res){
        try {
            VoteModel.findOne({positionId: req.params.positionId},(err, docs)=>{
                if(!err){
                    if(!docs) return res.status(404).send({"error":"Not found"});
                    let count = 0;
                    for (let i=0; i<docs.candidateId.length; i++){
                        if(docs.candidateId[i] == req.params.candidateId){
                            count = count + 1;
                            console.log(count);
                        }
                    }
                    
                    return res.status(200).send({"vote":count});
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async deleteVote(req,res){
        try {
            VoteModel.findOne(({_id: req.params.id}),(err, doc)=>{
                if(!err){
                    if (!doc)
                        return res.status(404).send({"error":"Vote not found"});

                    doc.remove((err, docs)=>{
                        if (!err){
                            res.status(200).send({"success":"Vote deleted"});
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

const mongoose = require('mongoose');
const mongosePaginate = require('mongoose-paginate');

let ImageSchema = new mongoose.Schema({
    voterId : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User'
    },
    candidateId : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User',
        required: true,
    },
    positionId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Position',
        required: true,
        unique: true,
    },
});

ImageSchema.plugin(mongosePaginate);
module.exports = mongoose.model("Vote", ImageSchema);

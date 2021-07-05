const mongoose = require('mongoose');
const mongosePaginate = require('mongoose-paginate');

let ImageSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    positionId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Position',
        required: true
    },
    count : {
        type : Number,
        default : 0
    },
});

ImageSchema.plugin(mongosePaginate);
module.exports = mongoose.model("Candidate", ImageSchema);
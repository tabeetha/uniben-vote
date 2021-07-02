const mongoose = require('mongoose');
const mongosePaginate = require('mongoose-paginate');

let PositionSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true,
        unique: true,
    },
});

PositionSchema.plugin(mongosePaginate);
module.exports = mongoose.model("Position", PositionSchema);
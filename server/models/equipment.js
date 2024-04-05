const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({

    created: {type: Date},
    equipmentID: {type: Number},
    location: {type: mongoose.Schema.Types.ObjectId, ref:'Room'},
    name: {type: String},
    status: {type: String},
    type: {type: String},
    updatedAt: {type: Date}


});

equipmentSchema.virtual('url').get(function(){
    return '/posts/equipment/' + this._id;
});

module.exports = mongoose.model('Equipment', equipmentSchema);
const mongoose = require('mongoose');

const procedureSchema = new mongoose.Schema({

    created: {type: Date},
    description: {type: String},
    estimatedDuration: {type: Number},
    name: {type: String},
    procedureID: {type: Number},
    requiredEquipment: [{type: mongoose.Schema.Types.ObjectId, ref:'Equipment'}],
    location: [{type: mongoose.Schema.Types.ObjectId, ref:'Room'}],
    requiredRoomType: {type: String},

});

procedureSchema.virtual('url').get(function(){
    return '/posts/procedure/' + this._id;
});

module.exports = mongoose.model('Procedure', procedureSchema);
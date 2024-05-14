const mongoose = require('mongoose');

const procedureSchema = new mongoose.Schema({

    created: {type: Date},
    description: {type: String},
    estimatedDuration: {type: Number},
    name: {type: String},
    requiredRoomType: {type: String},
    requiredEquipment: [{type: String}],
    staffType: {type: String},
    numStaff: {type: Number},
    notificationsSent: { type: [String], default: [] } 

});

procedureSchema.virtual('url').get(function(){
    return '/posts/procedure/' + this._id;
});

module.exports = mongoose.model('Procedure', procedureSchema);
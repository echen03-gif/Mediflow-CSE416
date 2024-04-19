const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({

    created: {type: Date},
    location: {type: mongoose.Schema.Types.ObjectId, ref:'Room'},
    name: {type: String},
    status: {type: String},
    type: {type: String},
    updatedAt: {type: Date},
    appointments: [{type: mongoose.Schema.Types.ObjectId, ref:'Appointments'}]


});

equipmentSchema.virtual('url').get(function(){
    return '/posts/equipment/' + this._id;
});

module.exports = mongoose.model('Equipment', equipmentSchema);
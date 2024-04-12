const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({

    created: {type: Date},
    equipment: [{type: mongoose.Schema.Types.ObjectId, ref:'Equipment'}],
    name: {type: String},
    roomID: {type: Number},
    status: {type: String},
    type: {type: String},
    updatedAt: {type: Date},
    appointments: [{type: mongoose.Schema.Types.ObjectId, ref:'Appointments'}]

});

roomSchema.virtual('url').get(function(){
    return '/posts/room/' + this._id;
});

module.exports = mongoose.model('Room', roomSchema);
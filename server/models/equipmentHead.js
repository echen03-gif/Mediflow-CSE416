const mongoose = require('mongoose');

const equipmentHeadSchema = new mongoose.Schema({

    name: {type: String},
    quantity: {type: Number},
    equipment: [{type: mongoose.Schema.Types.ObjectId, ref:'Equipment'}],
    type: {type: String},
    location: {type: mongoose.Schema.Types.ObjectId, ref:'Room'}


});

equipmentHeadSchema.virtual('url').get(function(){
    return '/posts/equipment/' + this._id;
});

module.exports = mongoose.model('EquipmentHead', equipmentHeadSchema);
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

    created: {type: Date},
    patientName: {type: String},
    staff: [{type: mongoose.Schema.Types.ObjectId, ref:'Users'}],
    scheduledEndTime: {type: Date},
    scheduledStartTime: {type: Date},
    process: {type: mongoose.Schema.Types.ObjectId, ref:'Processes'},
    location: [{type: mongoose.Schema.Types.ObjectId, ref:'Room'}]

});

appointmentSchema.virtual('url').get(function(){
    return '/posts/appointments/' + this._id;
});

module.exports = mongoose.model('Appointments', appointmentSchema);
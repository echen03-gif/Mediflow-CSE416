const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

    created: { type: Date },
    patientName: { type: String },
    procedures: [{
        staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
        procedure: { type: mongoose.Schema.Types.ObjectId, ref: 'Procedure' },
        equipment: [{type: mongoose.Schema.Types.ObjectId, ref:'Equipment'}]
    }],
    scheduledEndTime: { type: Date },
    scheduledStartTime: { type: Date },
    process: { type: mongoose.Schema.Types.ObjectId, ref: 'Processes' },
    location: [{
        room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
        procedure: { type: mongoose.Schema.Types.ObjectId, ref: 'Procedure' }
    }]
        
});

appointmentSchema.virtual('url').get(function () {
    return '/posts/appointments/' + this._id;
});

module.exports = mongoose.model('Appointments', appointmentSchema);
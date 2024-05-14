const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  created: { type: Date },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  procedures: [
    {
      staff: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
      procedure: { type: mongoose.Schema.Types.ObjectId, ref: "Procedure" },
      equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipment" }],
      scheduledEndTime: { type: Date },
      scheduledStartTime: { type: Date },
      room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" }
    },
  ],
  process: { type: mongoose.Schema.Types.ObjectId, ref: "Processes" },
  status: {
    type: String,
    enum: ["pending", "accepted", "cancelled", "completed"],
    default: "pending",
  },
});

appointmentSchema.virtual('url').get(function () {
    return '/posts/appointments/' + this._id;
});

module.exports = mongoose.model('Appointments', appointmentSchema);
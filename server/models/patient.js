const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  medicalHistory: [
    {
      condition: String,
      diagnosisDate: Date,
      notes: String,
    },
  ],
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
});

module.exports = mongoose.model("Patient", patientSchema);
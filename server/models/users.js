const mongoose = require('mongoose');


const shiftSchema = new mongoose.Schema({
    start: {type: String},
    end: {type: String}
});


const userSchema = new mongoose.Schema({

    admin: {type: Boolean},
    email: {type: String},
    joined: {type: Date},
    name: {type: String},
    age: {type: Number},
    gender: {type: String},
    password: {type: String},
    appointments: [{type: mongoose.Schema.Types.ObjectId, ref:'Appointments'}],
    role: {type: String},
    schedule: {
        Monday: [shiftSchema],
        Tuesday: [shiftSchema],
        Wednesday: [shiftSchema],
        Thursday: [shiftSchema],
        Friday: [shiftSchema],
        Saturday: [shiftSchema],
        Sunday: [shiftSchema]
    },
    processes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Processes' }],
    procedures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Procedure' }],
    profilePic: { type: String, default: 'default.jpg' },
    resetPasswordToken: {type: String},
    resetPasswordExpires: { type: Date }



});

userSchema.virtual('url').get(function(){
    return '/posts/user/' + this._id;
});

module.exports = mongoose.model('Users', userSchema);
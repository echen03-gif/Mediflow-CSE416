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
    password: {type: String},
    processes: [{type: mongoose.Schema.Types.ObjectId, ref:'Processes'}],
    role: {type: String},
    staffID: {type: Number},
    schedule: {
        Monday: [shiftSchema],
        Tuesday: [shiftSchema],
        Wednesday: [shiftSchema],
        Thursday: [shiftSchema],
        Friday: [shiftSchema],
        Saturday: [shiftSchema],
        Sunday: [shiftSchema]
    },


});

userSchema.virtual('url').get(function(){
    return '/posts/user/' + this._id;
});

module.exports = mongoose.model('Users', userSchema);
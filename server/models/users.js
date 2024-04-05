const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    admin: {type: Boolean},
    email: {type: String},
    joined: {type: Date},
    name: {type: String},
    password: {type: String},
    processes: [{type: mongoose.Schema.Types.ObjectId, ref:'Processes'}],
    role: {type: String},
    staffID: {type: Number},
    status: {type: String}

});

userSchema.virtual('url').get(function(){
    return '/posts/user/' + this._id;
});

module.exports = mongoose.model('Users', userSchema);
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

    roomID: {type: String},
    text: {type: String},
    sender: {type: String},
    senderID: {type: Number},
    timestamp: {type: Date},

});

messageSchema.virtual('url').get(function(){
    return '/posts/message/' + this._id;
});

module.exports = mongoose.model('Message', messageSchema);
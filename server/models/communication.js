const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({

    created: {type: Date},
    message: {type: String},
    messageID: {type: Number},
    receiverID: {type: mongoose.Schema.Types.ObjectId, ref:'Users'},
    senderID: {type: mongoose.Schema.Types.ObjectId, ref:'Users'},
    status: {type: String},
    type: {type: String},
    updatedAt: {type: Date}

});

communicationSchema.virtual('url').get(function(){
    return '/posts/communication/' + this._id;
});

module.exports = mongoose.model('Communication', communicationSchema);
const mongoose = require('mongoose');

const processesSchema = new mongoose.Schema({

    completed: {type: Date},
    components: [{type: mongoose.Schema.Types.ObjectId, ref:'Procedure'}],
    created: {type: Date},
    equipment: [{type: mongoose.Schema.Types.ObjectId, ref:'Equipment'}],
    staff: [{type: mongoose.Schema.Types.ObjectId, ref:'Users'}],
    status: {type: String}


});

processesSchema.virtual('url').get(function(){
    return '/posts/processes/' + this._id;
});

module.exports = mongoose.model('Processes', processesSchema);
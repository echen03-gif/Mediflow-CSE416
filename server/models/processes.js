const mongoose = require('mongoose');

const processesSchema = new mongoose.Schema({
    
    name: {type: String},
    completed: {type: Date},
    components: [{type: mongoose.Schema.Types.ObjectId, ref:'Procedure'}],
    created: {type: Date},
    status: {type: String}

});

processesSchema.virtual('url').get(function(){
    return '/posts/processes/' + this._id;
});

module.exports = mongoose.model('Processes', processesSchema);
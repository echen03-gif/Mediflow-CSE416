const mongoose = require('mongoose');

const processesSchema = new mongoose.Schema({
    
    name: {type: String},
    components: [{type: mongoose.Schema.Types.ObjectId, ref:'Procedure'}],
    created: {type: Date},

});

processesSchema.virtual('url').get(function(){
    return '/posts/processes/' + this._id;
});

module.exports = mongoose.model('Processes', processesSchema);
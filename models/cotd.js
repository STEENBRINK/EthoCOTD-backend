const mongoose = require('mongoose');
const schema = mongoose.Schema;

const COTDSchema = new mongoose.Schema( {
    cotd_number: {
        type: Number,
        required: true,
    },
    episode_id: {
        type: schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: String, 
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    _links: {
        type: Object,
        required: false
    }
}, {strict: false});

module.exports = mongoose.model('COTD', COTDSchema);
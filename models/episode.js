const mongoose = require('mongoose');
const schema = mongoose.Schema;

const EpisodeSchema = new mongoose.Schema( {
    title: {
        type: String,
        required: true
    },
    episode_number: {
        type: Number,
        required: true
    },
    release_date: {
        type: Date,
        required: true
    },
    cotd: {
        type: [schema.Types.ObjectId],
        ref: 'COTD',
        required: false
    },
    youtube_id: {
        type: String,
        required: true
    },
    season: {
        type: Number,
        required: false
    },
    minecraft_version: {
        type: String,
        required: false
    },
    _links: {
        type: Object,
        required: false
    }
}, {strict: false});

module.exports = mongoose.model('Episode', EpisodeSchema);
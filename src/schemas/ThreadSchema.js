const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Vul aub een titel in'],
        validate: {
            validator: (title) => title.length > 2,
            message: 'Titel moet langer zijn dan 2 characters.'
        }
    },
    content: {
        type: String,
        required: [true, 'Vul aub wat content in.'],
        validate: {
            validator: (content) => content.length > 2,
            message: 'De inhoud van het bericht moet langer zijn dan 2 characters.'
        }
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    upvotes: Number,
    downvotes: Number
});

module.exports = mongoose.model('thread', ThreadSchema);
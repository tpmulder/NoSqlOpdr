const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Thread title is required.'],
        validate: {
            validator: (title) => title.length > 2,
            message: 'Title must be longer than 2 characters.'
        }
    },
    content: {
        type: String,
        required: [true, 'A thread must have some content.'],
        validate: {
            validator: (content) => content.length > 2,
            message: 'The content of the thread must be at least 2 characters long.'
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
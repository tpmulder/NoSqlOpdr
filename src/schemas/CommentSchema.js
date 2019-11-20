const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Vul aub de post in']
    },
    reactions: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    upvotes: {
        type: Number
    },
    downvotes: {
        type: Number
    }
});

module.exports = mongoose.model('comment', CommentSchema);
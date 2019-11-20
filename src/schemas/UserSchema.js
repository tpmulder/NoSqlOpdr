const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the UserSchema for a single user.
const UserSchema = new Schema({
    username: String,
    password: String,

    // A user can be friends with other users.
    threads: [{
        type: Schema.Types.ObjectId,
        ref: 'thread'
    }],
    upvoted: [{
        type: Schema.Types.ObjectId,
        ref: 'thread'
    }],
    downvoted: [{
        type: Schema.Types.ObjectId,
        ref: 'thread'
    }]
});

// Create the user collection with the UserSchema.
const User = mongoose.model('user', UserSchema);

// Make the user available for the other files.
module.exports = User;
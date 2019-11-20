const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Vul een geldige gebruikersnaam in'],
        unique: [true, 'Deze gebruikersnaam is al in gebruik']
    },
    password: {
        type: String,
        required: [true, 'Vul een wachtwoord in']
    },
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

module.exports = mongoose.model('user', UserSchema);;
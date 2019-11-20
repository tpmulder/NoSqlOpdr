const User = require('../schemas/UserSchema');
const Comment = require('../schemas/CommentSchema');
const Thread = require('../schemas/ThreadSchema');
const ApiErrors = require('../errorMessages/apiErrors');

class CommentRepository {
    static createComment(threadId, username, content, res) {
        User.findOne({ username })
            .then((user) => {
                Thread.findOne({ _id: threadId })
                    .then((thread) => {
                        const newComment = new Comment({
                            content,
                            user,
                            reactions: [],
                            upvotes: 0,
                            downvotes: 0
                        });
                        thread.comments.push(newComment);

                        Promise.all([user.save(), thread.save(), newComment.save()])
                            .then(() => {
                                res.status(200).json({ message: "comment created and saved to the thread and user" })
                            })
                            .catch((error) => {
                                res.status(error.code).json(error);
                            })

                    })
                    .catch(() => {
                        res.status(500).json(ApiErrors.notFound());
                    });
            })
            .catch(() => {
                res.status(500).json(ApiErrors.internalServerError());
            })
    };

    static deleteComment(threadId, commentId, res) {
        Comment.findOneAndDelete({ _id: commentId })
            .then(() => {
                Thread.findOneAndUpdate({ _id: threadId }, { $pull: { "comments": commentId } })
                    .then(() => res.status(200).json({ message: "comment has been deleted" }))
                    .catch(() => res.status(500).json(ApiErrors.internalServerError()));
            })
            .catch(() => res.status(500).json(ApiErrors.internalServerError()));
    }

    /**
     * React to a comment
     * @param {*} username The username of the user that reacted to a comment
     * @param {*} content The content of the reaction
     * @param {*} commentId The commentId of the parrent comment. The comment that is created from this function will be added as reaction.
     * @param {*} res The http response that is used to return status codes and json.
     */
    static reactToComment(username, content, commentId, res) {
        User.findOne({username})
            .then((user) => {
                Comment.findOne({_id: commentId})
                    .then((comment) => {
                        if(comment) {
                            const reaction = new Comment({
                                content,
                                user,
                                upvotes: 0,
                                downvotes: 0
                            })
                            comment.reactions.push(reaction);
    
                            Promise.all([comment.save(), reaction.save()])
                                .then(() => res.status(201).json({"message": "Reaction is created."}))
                                .catch((error) => {
                                    res.status(error.code).json(error)
                                });
                        } else {
                            res.status(404).json(ApiErrors.notFound());
                        }
                    })
                    .catch((error) => {
                        res.status(error.code).json(error)
                    });
            })
            .catch((error) => {
                res.status(error.code).json(error)
            });
    }

    /**
     * Upvote a signle comment. If the same comment is downvote by the same user,
     * This downvote will be changed to a upvote.
     * @param {*} commentId The id of the comment that will be upvoted.
     * @param {*} username The username of the user that upvotes the comment.
     * @param {*} res The http response that is used to return status codes and json.
     */
    static upvote(commentId, username, res) {
        User.findOne({ username })
            .then((user) => {
                let isUpvoted = false;
                let isDownvoted = false;
                for (let vote of user.upvoted) {
                    if (vote == commentId) {
                        isUpvoted = true;
                    }
                }

                for (let vote of user.downvoted) {
                    if (vote == commentId) {
                        isDownvoted = true;
                    }
                }

                if (isDownvoted) {
                    Comment.update({ _id: commentId }, { $inc: { downvotes: -1 } })
                        .then(() => Comment.findOne({ _id: commentId }))
                        .then((comment) => {
                            if (comment) {
                                var index = user.downvoted.indexOf(commentId);
                                if (index >= 0) {
                                    user.downvoted.splice(index, 1);
                                }
                            } else {
                                console.log('Comment is null or undefined')
                            }
                        })
                        .catch((error) => {
                            res.status(error.code).json(error);
                        })
                }

                if (!isUpvoted) {
                    Comment.update({ _id: commentId }, { $inc: { upvotes: 1 } })
                        .then(() => Comment.findOne({ _id: commentId }))
                        .then((comment) => {
                            if (comment) {
                                user.upvoted.push(commentId)

                                return user.save()
                            } else {
                                res.status(404).json(ApiErrors.notFound())
                            }
                        })
                        .then(() => {
                            res.status(200).json({ "message": "Comment has been upvoted" })
                        })
                        .catch((error) => {
                            res.status(error.code).json(error);
                        })
                } else {
                    res.status(403).json({ "message": "You already upvoted this comment" });
                }
            })
            .catch((error) => {
                res.status(error.code).json(error);
            })
    }

    /**
     * Downvote a single comment. If the same comment is upvoted by the same user,
     * This upvote will be changed to a downvote.
     * @param {*} commentId The id of the comment that will be downvoted.
     * @param {*} username The username of the user that upvotes the comment.
     * @param {*} res The http response that is used to return status codes and json.
     */
    static downvote(commentId, username, res) {
        User.findOne({ username })
            .then((user) => {
                let isDownvoted = false;
                let isUpvoted = false;
                for (let vote of user.downvoted) {
                    if (vote == commentId) {
                        isDownvoted = true;
                    }
                }

                for (let vote of user.upvoted) {
                    if (vote == commentId) {
                        isUpvoted = true;
                    }
                }

                if (isUpvoted) {
                    Comment.update({ _id: commentId }, { $inc: { upvotes: -1 } })
                        .then(() => Comment.findOne({ _id: commentId }))
                        .then((comment) => {
                            if (comment) {
                                var index = user.upvoted.indexOf(commentId);
                                if (index >= 0) {
                                    user.upvoted.splice(index, 1);
                                }
                            } else {
                                console.log('Comment is null or undefined')
                            }
                        })
                        .catch((error) => {
                            res.status(error.code).json(error);
                        })
                }

                if (!isDownvoted) {
                    Comment.update({ _id: commentId }, { $inc: { downvotes: 1 } })
                        .then(() => Comment.findOne({ _id: commentId }))
                        .then((comment) => {
                            if (comment) {
                                user.downvoted.push(commentId)

                                return user.save()
                            } else {
                                res.status(404).json(ApiErrors.notFound())
                            }
                        })
                        .then(() => {
                            res.status(200).json({ "message": "Comment has been downvoted" })
                        })
                        .catch((error) => {
                            res.status(error.code).json(error);
                        })
                } else {
                    res.status(403).json({ "message": "You already downvoted this Comment" });
                }
            })
            .catch((error) => {
                res.status(error.code).json(error);
            })
    }
}

module.exports = CommentRepository;

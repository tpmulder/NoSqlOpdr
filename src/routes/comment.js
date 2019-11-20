const express = require("express");
const router = express.Router();
const apiErrors = require("../errorMessages/apiErrors.js");
const repo = require('../dataAccess/commentRepository');

router.get('/', (req, res) => {

});

/* Create a new comment based on thead id, user needs to be logged in*/
router.post('/:threadId', (req, res) => {
    const threadId = req.params.threadId;
    const createCommentObject = req.body;

    if (!CheckObjects.isValidComment(createCommentObject)) {
        const error = apiErrors.wrongRequestBodyProperties;
        res.status(error.code).json(error);
        return;
    }

    const content = createCommentObject.content;

    repo.createComment(threadId, req.user.username, content, res);
});

router.post('/react/:commentId', (req, res) => {
    const commentId = req.params.commentId || '';
    const username = req.user.username || '';
    const content = req.body.content || '';

    repo.reactToComment(username, content, commentId, res);
});

router.delete('/:threadId/:commentId', (req, res) => {
    const threadId = req.params.threadId;
    const commentId = req.params.commentId;

    repo.deleteComment(threadId, commentId, res)
});

router.put('/:id/upvote', (req, res) => {
    const username = req.user.username || '';
    const threadId = req.params.id || '';

    repo.upvote(threadId, username, res);
})

router.put('/:id/downvote', (req, res) => {
    const username = req.user.username || '';
    const threadId = req.params.id || '';

    repo.downvote(threadId, username, res); 
})

class CheckObjects {
    static isValidComment(object) {
        const tmp =
            object && typeof object == "object" &&
            object.content && typeof object.content == "string";
        return tmp == undefined ? false : tmp;
    }
}

module.exports = router;
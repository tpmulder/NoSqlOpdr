const express = require("express");
const router = express.Router();
const ThreadRepository = require('../dataAccess/threadRepository');

/**
 * Get all the threads that the current logged in user has
 */
router.get('/', (req, res) => {
    const username = req.user.username || '';
    ThreadRepository.getAllThreadsForSingleUser(username, res);
});

router.get('/all/:sort?', (req, res) => {
    const sortStyle = req.params.sort || '';

    ThreadRepository.getAllThreads(sortStyle, res);
})

router.get('/:id', (req, res) => {
    const threadId = req.params.id || '';

    ThreadRepository.getSingleThreadWithComments(threadId, res);
})

/**
 * Create a new thread, and add the reference to the user threads array
 */
router.post('/', (req, res) => {
    const title = req.body.title || '';
    const content = req.body.content || '';
    const username = req.user.username || '';

    ThreadRepository.createThread(title, content, username, res);
});

/**
 * Delete a single thread by it's id.
 */
router.delete('/:id', (req, res) => {
    const threadId = req.params.id || '';
    const username = req.user.username || '';

    ThreadRepository.deleteThread(threadId, username, res);
})

router.put('/:id', (req, res) => {
    const threadId = req.params.id || '' ;
    const newContent = req.body.content || '';

    ThreadRepository.updateThread(threadId, newContent, res);
})

router.put('/:id/upvote', (req, res) => {
    const username = req.user.username || '';
    const threadId = req.params.id || '';

    ThreadRepository.upvote(threadId, username, res);
})

router.put('/:id/downvote', (req, res) => {
    const username = req.user.username || '';
    const threadId = req.params.id || '';

    ThreadRepository.downvote(threadId, username, res); 
})

module.exports = router;
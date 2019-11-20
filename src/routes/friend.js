const express = require("express");
const router = express.Router();
const apiErrors = require("../errorMessages/apiErrors.js");
const repo = require('../dataAccess/friendRepository');

router.delete('/', (req, res) => {
    const newFriend = req.body;

    if (!CheckObjects.isValidFriend(newFriend)) {
        const error = apiErrors.wrongRequestBodyProperties;
        res.status(error.code).json(error);
        return;
    }

    const usernameFriend = newFriend.usernameFriend;

    repo.deleteFriendShip(req.user.username, usernameFriend, res);
});

router.post('/', (req, res) => {
    const newFriend = req.body;

    if (!CheckObjects.isValidFriend(newFriend)) {
        const error = apiErrors.wrongRequestBodyProperties;
        res.status(error.code).json(error);
        return;
    }

    const usernameFriend = newFriend.usernameFriend;

    repo.createFriendship(req.user.username, usernameFriend, res);
});

class CheckObjects {
    static isValidFriend(object) {
        const tmp =
            object && typeof object == "object" &&
            object.usernameFriend && typeof object.usernameFriend == "string";
        return tmp == undefined ? false : tmp;
    }
}


module.exports = router;
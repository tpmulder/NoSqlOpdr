const express = require("express");
const router = express.Router();
const auth = require('../authentication/authentication');
const apiErrors = require("../errorMessages/apiErrors.js");
const Isemail = require('isemail');
const repo = require('../dataAccess/userRepository');

router.all(new RegExp("^(?!\/login$|\/register$).*"), (request, response, next) => {
    // Get the token from the request header.
    const token = request.header('X-Access-Token');

    auth.decodeToken(token, (error, payload) => {
        if (error) {
            // Print the error message to the console.
            console.log('Error handler: ' + error.message);

            // Set the response's status to error.status or 401 (Unauthorised).
            // Return json to the response with an error message.
            response.status((error.status || 401)).json(apiErrors.notAuthorised)
        } else {
            request.user = {
                username: payload.sub
            };
            next();
        }
    })
});

router.route("/register").post((request, response) => {
    const registration = request.body;
    if (!CheckObjects.isValidRegistration(registration)) {
        const error = apiErrors.wrongRequestBodyProperties;
        response.status(error.code).json(error);
        return;
    }

    // Get the users information to store in the database.
    const username = registration.username;
    const email = registration.email;
    const password = registration.password;

    repo.createUser(username, email, password, response);
});

router.route("/login").post((request, response) => {
    const loginObject = request.body;
    if (!CheckObjects.isValidLogin(loginObject)) {
        const error = apiErrors.wrongRequestBodyProperties;
        response.status(error.code).json(error);
        return;
    }
    // Get the username and password from the request.
    const username = loginObject.username;
    const password = loginObject.password;

    repo.login(username, password, response);
});

router.route("/user/changepassword").post((request, response) => {
    const changepasswordObject = request.body;

    if (!CheckObjects.isValidPasswordChange(changepasswordObject)) {
        const error = apiErrors.wrongRequestBodyProperties;
        response.status(error.code).json(error);
        return;
    }

    const password = changepasswordObject.password;
    const newPassword = changepasswordObject.newPassword;

    repo.changePassword(request.user.username, password, newPassword, response);

});

router.route("/user").delete((request, response) => {
    repo.deleteUser(request.user.username, response);
});


class CheckObjects {
    // Returns true if the given object is a valid login
    static isValidLogin(object) {
        const tmp =
            object && typeof object == "object" &&
            object.username && typeof object.username == "string" &&
            object.password && typeof object.password == "string";
        return tmp == undefined ? false : tmp;
    }

    // Returns true if the given object is a valid register
    static isValidRegistration(object) {
        const tmp =
            object && typeof object == "object" &&
            object.username && typeof object.username == "string" && object.username.length >= 2 &&
            object.email && typeof object.email == "string" && Isemail.validate(object.email) &&
            object.password && typeof object.password == "string";
        return tmp == undefined ? false : tmp;
    }

    static isValidPasswordChange(object) {
        const tmp =
            object && typeof object == "object" &&
            object.password && typeof object.password == "string" &&
            object.newPassword && typeof object.newPassword == "string";
        return tmp == undefined ? false : tmp;
    }
}

module.exports = router;
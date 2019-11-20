const apiError = require("./apiError.js");

module.exports = class apiErrors {
    /**
     * Similar to 403 Forbidden,
     * but specifically for use when authentication is required and has failed or has not yet been provided.
     * The response must include a X-Access-Token header field containing a challenge applicable to the requested resource.
     * @returns {Error} Not authorized 401.
     */
    static notAuthorised(){
        return new apiError("Niet geautoriseerd", 401);
    }

    /**
     * Method that will be used when a user sends an invalid token
     * @returns {Error} Invalid Token 498.
     */
    static noValidToken() {
        return new apiError("Invalid Token", 498);
    }

    /**
     * Indicates that the request could not be processed because of conflict in the request
     * @returns {apiErrors} Conflict 409.
     */
    static conflict() {
        return new apiError("Conflict", 409);
    }

    /**
     * The server cannot or will not process the request due to an apparent client apiErrors
     * e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing).
     * @returns {apiErrors} Bad Request 400.
     */
    static badRequest() {
        return new apiError("Bad Request", 400);
    }

    /**
     * The request was valid, but the server is refusing action.
     * The user might not have the necessary permissions for a resource, or may need an account of some sort.
     * @returns {apiErrors} Forbidden 403.
     */
    static forbidden() {
        return new apiError("Forbidden", 403);
    }

    /**
     *
     * @returns {apiErrors}
     */
    static requestTimeout() {
        return new apiError("Request Timeout", 408);
    }

    /**
     * A generic apiErrors message,
     * given when an unexpected condition was encountered and no more specific message is suitable.
     * @returns {apiErrors}
     */
    static internalServerError() {
        return new apiError("Internal Server Error", 500);
    }

    /**
     * The requested resource could not be found but may be available in the future.
     * Subsequent requests by the client are permissible.
     * @returns {apiErrors} Not Found, 404
     */
    static notFound() {
        return new apiError("Not Found", 404);
    }

    /**
     * The 520 apiErrors is used as a "catch-all response for when the origin server returns something unexpected",
     * listing connection resets, large headers, and empty or invalid responses as common triggers.
     * @returns {apiErrors} Unknown apiErrors, 520
     */
    static unknownError() {
        return new apiError("Unknown Error", 520);
    }

    /**
     * Unofficial HTTP Response.
     * This response is self reclaimed.
     * @returns {apiErrors} User Exists, 420
     */
    static userExists() {
        return new apiError("User Exists", 420);
    }


    static get wrongRequestBodyProperties(){
        return new apiError("Een of meer properties in de request body ontbreken of zijn foutief", 412);
    }

    static notFound(objectName){
        return new apiError(`Niet gevonden (${objectName} bestaat niet)`, 404);
    }

    static conflict(message){
        return new apiError(`Conflict (${message})`, 409);
    }

    static other(message, code = 500){
        return new apiError(message, code);
    }
}
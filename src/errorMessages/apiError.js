module.exports = class apiError {
    constructor(message, code){
        this.message = message;
        this.code = code;
        this.datetime = new Date().toISOString();
    }
};
const auth = require('../authentication/authentication');
const User = require('../schemas/UserSchema');
const ApiErrors = require('../errorMessages/apiErrors');
const neo4j = require('neo4j-driver').v1;
const config = require('../../config');
const driver = neo4j.driver('bolt://localhost:7687/', neo4j.auth.basic(config.neo4jUser, config.neo4jPassword));

module.exports = class UserRepository {
    static createUser(username, email, password, response) {
        User.findOne({username})
            .then((user) => {
                if (user === null) {
                    const newUser = new User({ username: username, email: email, password: password });
                    newUser.save()
                        .then(() => {
                            const session = driver.session();

                            //create user in neo4j database
                            session
                                .run( `CREATE (a:User {username: '${newUser.username}'})`)
                                .then(function (result) {
                                    result.records.forEach(function (record) {
                                    });
                                    session.close();

                                    //user has been created in mongoDB and neo4j
                                    let token = auth.encodeToken(username);
                                    response.status(200).json({token});
                                })
                                .catch(function (error) {
                                    UserRepository.deleteUser(username, response);
                                    response.status(500).json(ApiErrors.internalServerError());
                                });
                        })
                        .catch(() => response.status(500).json(ApiErrors.internalServerError()))
                } else response.status(420).json(ApiErrors.userExists());
            })
            .catch(() => response.status(500).json(ApiErrors.internalServerError())
            );
    };

    static login(username, password, response) {
        User.findOne({username})
            .then((user) => {
                if(user.password === password){
                    let token = auth.encodeToken(username);
                    response.status(200).json({token});
                } else {
                    response.status(401).json(ApiErrors.notAuthorised());
                }
            })
            .catch(() => {
                response.status(401).json(ApiErrors.notAuthorised())
            });

    };

    static changePassword(username, password, newPassword, response) {
        User.findOne({username})
            .then((user) => {
                if(user.password === password){
                    user.set({password: newPassword});
                    user.save()
                        .then(() => {
                            response.status(200).json({message: "your password has been changed."});
                        })
                        .catch(() => {
                            response.status(500).json(ApiErrors.internalServerError());
                        })

                } else {
                    response.status(401).json(ApiErrors.notAuthorised());
                }
            })
            .catch(() => {
                response.status(404).json(ApiErrors.notFound(username));
            });
    };

    static deleteUser(username, response){
        User.findOneAndDelete({username})
            .then(() => {
                const session = driver.session();

                session
                    .run('MATCH (a:User { username: "' + username + '"}) DETACH DELETE a')
                    .then(function (result) {
                        result.records.forEach(function (record) {});
                        session.close();

                        response.status(200).json({message: "the user has been deleted."});
                    })
                    .catch(function (error) {
                        response.status(500).json(ApiErrors.internalServerError());
                    });
            })
            .catch(() => {
                response.status(500).json(ApiErrors.internalServerError());
            });
    };
};

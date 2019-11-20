const ApiErrors = require('../errorMessages/apiErrors');
const neo4j = require('neo4j-driver').v1;
const config = require('../../config');
const driver = neo4j.driver('bolt://localhost:7687/', neo4j.auth.basic(config.neo4jUser, config.neo4jPassword));

class UserRepository {
    static createFriendship(username, usernameNewFriend, response){
        const session = driver.session();
        session
            .run('MATCH (a:User {username: "' + username + '"}) ' +
                'MATCH (b:User {username: "' + usernameNewFriend + '"}) ' +
                'MERGE (a)-[:FRIENDS]-(b)')
            .then(function (result) {
                result.records.forEach(function (record) {});
                session.close();

                response.status(200).json({message: username + " and " + usernameNewFriend + " are now friends"});
            })
            .catch(function (error) {
                response.status(500).json(ApiErrors.internalServerError());
            });
    }

    static deleteFriendShip(username, usernameNewFriend, response){
        const session = driver.session();
        session
            .run('MATCH (a:User {username: "'+ username +'"}) '
                +'MATCH (b:User {username: "'+ usernameNewFriend +'"}) '
                +'MATCH (a)-[r]-(b) '
                +'DELETE r')
            .then(function (result) {
                result.records.forEach(function (record) {});
                session.close();

                response.status(200).json({message: username + " and " + usernameNewFriend + " are no longer friends"});
            })
            .catch(function (error) {
                response.status(500).json(ApiErrors.internalServerError());
            });
    }
}

module.exports = UserRepository;







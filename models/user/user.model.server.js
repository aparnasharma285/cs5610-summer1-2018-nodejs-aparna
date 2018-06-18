var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var userModel = mongoose.model('UserModel', userSchema);

function findUserByCredentials(credentials) {
    return userModel.findOne(credentials);
}

function findUserById(userId) {
    return userModel.findById(userId);
}

function createUser(user) {
    return findUserByUsername(user.username).then(response => {
            if (response.length > 0) {
                return {error:"User Already Exists!"};
            } else {
                return userModel.create(user);
            }
        })

}

function findUserByUsername(username) {
    return userModel.find({username: username});
}

function findAllUsers() {
    return userModel.find();
}

var api = {
    createUser: createUser,
    findAllUsers: findAllUsers,
    findUserById: findUserById,
    findUserByCredentials: findUserByCredentials,
    findUserByUsername: findUserByUsername
};

module.exports = api;
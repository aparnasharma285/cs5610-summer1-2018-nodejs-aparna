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
            return {error: "User Already Exists!"};
        } else {
            return userModel.create(user);
        }
    })

}

function updateUser(updatedUser) {

    userModel.findOne({username: updatedUser.username}, function (err, existingUser) {
        if (updatedUser.password != null && updatedUser.password.length > 0) {
            existingUser.password = updatedUser.password;
        }
        if (updatedUser.email != null && updatedUser.email.length > 0) {
            existingUser.email = updatedUser.email;
        }
        if (updatedUser.firstName != null && updatedUser.firstName.length > 0) {
            existingUser.firstName = updatedUser.firstName;
        }
        if (updatedUser.lastName != null && updatedUser.lastName.length > 0) {
            existingUser.lastName = updatedUser.lastName;
        }
        if (updatedUser.phone != null && updatedUser.phone.length > 0) {
           existingUser.phone = updatedUser.phone;
        }
        if (updatedUser.address != null && updatedUser.address.length > 0) {
            existingUser.address = updatedUser.address;
        }

        return existingUser.save();
    })

    return updatedUser;
}

function findUserByUsername(username) {
    return userModel.find({username: username});
}

function findAllUsers() {
    return userModel.find();
}

function deletingProfile(username) {
    userModel.remove({"username":username},function (err, result) {
        if (err) {
            return -1;
        }})
}

var api = {
    createUser: createUser,
    findAllUsers: findAllUsers,
    findUserById: findUserById,
    findUserByCredentials: findUserByCredentials,
    findUserByUsername: findUserByUsername,
    updateUser: updateUser,
    deletingProfile: deletingProfile
};

module.exports = api;
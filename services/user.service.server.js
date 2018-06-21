module.exports = function (app) {
    app.get('/api/user', findAllUsers);
    app.get('/api/user/:userId', findUserById);
    app.get('/api/user/username/:username', findUserByUsername);
    app.post('/api/register', createUser);
    app.put('/api/profile', updateProfile);
    app.get('/api/profile', profile);
    app.delete('/api/profile', deleteProfile);
    app.post('/api/logout', logout);
    app.post('/api/login', login);
    app.get('/api/status', getLoginStatus);

    var userModel = require('../models/user/user.model.server');
    var sectionModel = require('../models/section/section.model.server');
    var enrollmentModel = require('../models/enrollment/enrollment.model.server');

    function login(req, res) {
        var credentials = req.body;
        userModel
            .findUserByCredentials(credentials)
            .then(function (user) {
                if(user){

                    req.session['currentUser'] = user;
                    req.session.cookie.maxAge = (30 * 60 * 1000);
                    res.json(user);
                } else {
                    res.sendStatus(204);
                    }
            })
    }

    function logout(req, res) {
        req.session.destroy();
        res.send(200);
    }

    function findUserById(req, res) {
        var id = req.params['userId'];
        userModel.findUserById(id)
            .then(function (user) {
                res.json(user);
            })
    }

    function findUserByUsername(req, res) {
        var username = req.params['username'];
        userModel.findUserByUsername(username)
            .then(function (user) {
                if (user !== null){
                res.json(user);
                } else {
                    res.sendStatus(204);
                }
            })
    }

    function profile(req, res) {
        res.send(req.session['currentUser']);
    }

    function createUser(req, res) {
        var user = req.body;
        userModel.createUser(user)
            .then(function (response) {
                if (response.error !== undefined) {
                    res.json(response);
                } else {
                    req.session['currentUser'] = response;
                    res.json(response);
                }
            })
    }

    function updateProfile(req, res) {
        var updatedUser = req.body;
        userModel.updateUser(updatedUser);
        return res.sendStatus(200);
    }

    function findAllUsers(req, res) {
        userModel.findAllUsers()
            .then(function (users) {
                res.send(users);
            })
    }

    function getLoginStatus(req,res) {
        if (req.session['currentUser'] !== undefined){
            res.sendStatus(200)
        } else {
            res.sendStatus(204)
        }
    }

    function deleteProfile(req,res) {
        enrollmentModel.findSectionsForStudent()
            .then(enrollments => {
                enrollments.map(enrollment => {
                    enrollmentModel.unenrollStudentInSection(enrollment)
                })});
        user = req.session['currentUser'];
        userModel.deletingProfile(user.username);
        res.sendStatus(200);
    }
}

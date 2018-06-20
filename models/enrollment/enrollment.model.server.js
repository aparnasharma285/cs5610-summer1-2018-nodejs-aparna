var mongoose = require('mongoose');
var enrollmentSchema = require('./enrollment.schema.server');
var enrollmentModel = mongoose.model(
    'EnrollmentModel',
    enrollmentSchema
);
var ObjectId = require('mongodb').ObjectID;

function enrollStudentInSection(enrollment) {
    return enrollmentModel.create(enrollment);
}

function unenrollStudentInSection(enrollment) {
    enrollmentModel.remove({"student":ObjectId(enrollment.student),"section":ObjectId(enrollment.section)},
        function (err, result) {

        if (err) {
            return response.status(204);
        }
    })
}

function findSectionsForStudent(studentId) {
    return enrollmentModel
        .find({student: studentId})
        .populate('section')
        .exec();
}

module.exports = {
    enrollStudentInSection: enrollStudentInSection,
    unenrollStudentInSection: unenrollStudentInSection,
    findSectionsForStudent: findSectionsForStudent
};
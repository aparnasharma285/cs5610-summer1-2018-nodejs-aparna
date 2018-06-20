var mongoose = require('mongoose');
var sectionSchema = require('./section.schema.server');
var sectionModel = mongoose.model('SectionModel', sectionSchema);
var enrollmentSchema = require('../enrollment/enrollment.schema.server');
var enrollmentModel = mongoose.model(
    'EnrollmentModel',
    enrollmentSchema
);
var ObjectId = require('mongodb').ObjectID;

function createSection(section) {
    return sectionModel.create(section);
}

function findSectionsForCourse(courseId) {
    return sectionModel.find({courseId: courseId});
}

function decrementSectionSeats(sectionId) {
    return sectionModel.update({
        _id: sectionId
    }, {
        $inc: {seats: -1}
    });
}

function incrementSectionSeats(sectionId) {
    return sectionModel.update({
        _id: sectionId
    }, {
        $inc: {seats: +1}
    });
}

function updatingSection(section){
    sectionModel.findOne({_id: section._id}, function (err, existingSection){
            if (section.name !== null && section.name.length > 0) {
                existingSection.name = section.name;
            }
            if (section.seats > -1) {
                existingSection.seats = section.seats;
            }
        if (section.maxSeats > -1) {
            existingSection.maxSeats = section.maxSeats;
        }

            return existingSection.save();
        })

}

function deletingSection(sectionId) {

    deleteSection = sectionModel.findOne({"_id":sectionId});
    enrollmentModel.remove({"section": ObjectId(sectionId)}, function (err, result) {
        if (err) {
            return -1;
        }
    });
    sectionModel.remove({_id: sectionId}, function (err, result) {
        if (err) {
            return -1;
        }
    })
}


function findById(sectionId) {
    return sectionModel.find({"_id" : sectionId})
}

module.exports = {
    createSection: createSection,
    findSectionsForCourse: findSectionsForCourse,
    decrementSectionSeats: decrementSectionSeats,
    incrementSectionSeats: incrementSectionSeats,
    updatingSection: updatingSection,
    deletingSection: deletingSection,
    findById: findById
};
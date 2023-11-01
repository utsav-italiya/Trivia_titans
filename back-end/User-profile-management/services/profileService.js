const User = require("../models/userProfile");

const saveUserProfile = (params, callback) => {
  const user = new User(params);

  user.save((err) => {
    if (err) {
      callback(err);
    } else {
      callback(null, user);
    }
  });
};

const getProfileData = (userId, callback) => {

    console.log(userId)

    User.getProfileByUserId(userId, (err, profile) => {
      if (err) {
        callback(err);
      } else {
        callback(null, profile);
      }
    });
  };


  const updateProfile = (userId, updatedData, callback) => {
    User.updateProfileByUserId(userId, updatedData, (err, updatedProfile) => {
      if (err) {
        callback(err);
      } else {
        callback(null, updatedProfile);
      }
    });
  };

  const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAllprofiles = (callback) => {
  const params = {
    TableName: 'userprofile',
  };

  dynamodb.scan(params, (err, data) => {
    if (err) {
      callback(err);
    } else {
      const profiles = data.Items;
      callback(null, profiles);
    }
  });
};


module.exports = {
  saveUserProfile,
  getProfileData,
  updateProfile,
  getAllprofiles
};
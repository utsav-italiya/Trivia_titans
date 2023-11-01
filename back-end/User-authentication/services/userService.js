// userService.js (service)
const axios = require('axios');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
// Configure AWS Cognito
const cognito = new AWS.CognitoIdentityServiceProvider({
  region: 'us-east-1',
  apiVersion: '2016-04-18',
});

const registerUser=(params, callback) =>{
  cognito.signUp(params, (err, data) => {
    if (err) {
      console.error(err);
      return callback(err);
    }

    const userId = data.UserSub;
    return callback(null, userId);
  });
}

const verifyUser=(params, callback) =>{
  cognito.confirmSignUp(params, (err, data) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    const userId = data.UserSub;
    return callback(null, userId);
  });
}

const verifyUserWithoutCode = (params, callback) => {
  cognito.adminConfirmSignUp(params, (err, data) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    return callback(null, data);
  });
};

const loginUser = (params, callback) => {
  cognito.initiateAuth(params, (err, data) => {
    if (err) {
      console.error(err);
      return callback(err);
    }

    const accessToken = data.AuthenticationResult.AccessToken;
    const idToken = data.AuthenticationResult.IdToken;
    const refreshToken = data.AuthenticationResult.RefreshToken;
    const decodedIdToken = jwt.decode(idToken);
    const userId = decodedIdToken.sub;
    const email = decodedIdToken.email;

    const tokens = {
      accessToken,
      idToken,
      refreshToken,
      userId,
      email
    };

    return callback(null, tokens);
  });
};

const forgotPassword = (params, callback) => {
  cognito.forgotPassword(params, (err, data) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    
    return callback(null, data);
  });
};

const signOut = (params, callback) => {
  cognito.globalSignOut(params, (err) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      callback(null);
    }
  });
};

const resetPassword = (params, callback) => 
{
  cognito.confirmForgotPassword
  (params, (err, data)=>
    {
    if (err) {
      console.error(err);
      return callback(err);
    }
    return callback(null, data);
  });
};

const getUser = (params, callback) => {
  cognito.getUser(params, (err, data) => {
    if (err) {
      console.error(err);
      return callback(err); // Return the callback to exit the function
    }
    const user = data.UserAttributes;
    callback(null, user);
  });
};

const getAllUsers = (params, callback) => {
  cognito.listUsers(params, (err, data) => {
    if (err) {
      console.error(err);
      return callback(err); // Return the callback to exit the function
    }

    const users = data.Users.map(user => {
      const userAttributes = {};

      // Extract standard attributes
      user.Attributes.forEach(attribute => {
        userAttributes[attribute.Name] = attribute.Value;
      });

      return userAttributes;
    });

    callback(null, users);
  });
};



const updateUser = (params, callback) => {
  cognito.updateUserAttributes(params, (err, data) => {
    if (err) {
      console.error(err);
      return callback(err); // Return the callback to exit the function
    }
    callback(null, data);
  });
};




const getAll = async (req, res, params) => {

  try {
    // Fetch data from Cognito API
    const cognitoData = await new Promise((resolve, reject) => {
      cognito.listUsers(params, (err, data) => {
        if (err) {
          console.error(err);
          return reject(err);
        }

        const users = data.Users.map(user => {
          const userAttributes = {};
          user.Attributes.forEach(attribute => {
            userAttributes[attribute.Name] = attribute.Value;
          });
          return userAttributes;
        });

        resolve(users);
      });
    });


    // Fetch data from Axios API
    const axiosResponse = await axios.get('https://4medd3y7ri.execute-api.us-east-1.amazonaws.com/get-all-profile');

    const axiosDataMap = axiosResponse.data.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});


    // Combine the responses based on the id field
    const combinedResponse = cognitoData.map(user => {
      const userId = user.sub; 
      if (axiosDataMap.hasOwnProperty(userId)) {
        const { sub, ...restOfUser } = user;
        return {
          ...restOfUser,
          ...axiosDataMap[userId]
        };
      } else {
        return user;
      }
    });
    return combinedResponse;
  } catch (error) {
    throw error;
  }
};



module.exports = {
  registerUser,
  verifyUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUser,
  signOut,
  updateUser,
  getAllUsers,
  verifyUserWithoutCode,
  getAll
};

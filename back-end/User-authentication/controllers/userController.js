// userController.js (controller)

const express = require('express');
const bodyParser = require('body-parser');
const UserService = require('../services/userService');
const AWS = require('aws-sdk');

const app = express();
app.use(bodyParser.json());

AWS.config.update({ region: 'us-east-1' });
const s3 = new AWS.S3();
const s3BucketName = 'triviaprofilebucket';


const RegisterUser = (req, res) => {

  const { name, email, gender, birthdate, password } = req.body;

  if (!name || !email || !gender || !birthdate || !password) {
    console.log(req.body);
    return res.status(400).json({ message: 'Missing required fields.....' });
  }

  const params = {
    ClientId: '1nnqa4t3fkr2eg3k9ce86fe2sv',
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'name',
        Value: name,
      },
      {
        Name: 'gender',
        Value: gender,
      },
      {
        Name: 'birthdate',
        Value: birthdate,
      }
    ],
  };

  console.log(params)
  UserService.registerUser(params, (error, userId) => {
    if (error) {
      return res.status(200).json({ error });
    }

    return res.status(200).json({ userId });
  });
};

const VerifyUser = (req, res) => {
  const { userId, verificationCode } = req.body;

  const params = {
    ClientId: '1nnqa4t3fkr2eg3k9ce86fe2sv',
    Username: userId,
    ConfirmationCode: verificationCode 
  };

  UserService.verifyUser(params, (err) => {
    if (err) {
      return res.status(500).json({ message: 'User verification failed' });
    }
    return res.status(200).json({ message: 'User verification successful' });
  });
};

const VerifyUserWithoutCode = (req, res) => {
  const { email } = req.body;

  const params = {
    UserPoolId: 'us-east-1_cQI5wZa9W',
    Username: email
  };

  UserService.verifyUserWithoutCode(params, (err) => {
    if (err) {
      return res.status(500).json({ message: 'User email verification failed' });
    }
    return res.status(200).json({ message: 'User email verification successful' });
  });
};


const LoginUser = (req, res) => {
  const { userId, password } = req.body;

  const params = {
    ClientId: '1nnqa4t3fkr2eg3k9ce86fe2sv',
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: userId,
      PASSWORD: password
    }
  };

  UserService.loginUser(params, (err, tokens) => {
    if (err) {
      return res.status(500).json({ message: 'User login failed' });
    }
    return res.status(200).json({ message: tokens });
  });
};

const ForgotPassword = (req, res) => {

  console.log("hello world")
  const { userId } = req.body;

  const params = {
    ClientId: '1nnqa4t3fkr2eg3k9ce86fe2sv',
    Username: userId
  };

  UserService.forgotPassword(params, (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Password reset failed' });
    }
    return res.status(200).json({ message: 'Password reset initiated', codeDeliveryDetails: data.CodeDeliveryDetails });
  });
};



const ResetPassword = (req, res) => {
  const { userId, verificationCode, newPassword } = req.body;

  const params = {
    ClientId: '1nnqa4t3fkr2eg3k9ce86fe2sv',
    Username: userId,
    ConfirmationCode: verificationCode,
    Password: newPassword
  };

  UserService.resetPassword(params, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Password reset failed' });
    }
    return res.status(200).json({ message: 'Password reset successful' });
  });
};

const signOut = (req, res) => {
  const params = {
    AccessToken: req.headers.authorization,
  };

  UserService.signOut(params, (err) => {
    if (err) {
      const errorMessage = {
        message: "Signout failed.",
        error: err,
      };
      res.status(500).send(errorMessage); // 500 Internal Server Error
    } else {
      const successMessage = {
        message: "Signout successful.",
      };
      res.status(200).send(successMessage); // 200 OK
    }
  });
};


const deleteUser = async (req, res) => {
  try {
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: req.headers.username,
    };

    const response = await UserService.deleteUser(params);

    if (!response.error) {
      res.status(200).send({ message: "User Deleted Successfully!" }); // 200 OK
    } else {
      res.status(400).send(response); // 400 Bad Request (or any other appropriate status code)
    }
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.status(500).send(errorMessage); // 500 Internal Server Error
  }
};



const verifyToken = (req, res) => {
  const params = {
    AccessToken: req.body.token,
  };

  UserService.getUser(params, (err, user) => {
    if (err) {
      console.error(err);
      const errorMessage = {
        message: "Internal Server Error.",
        error: err,
      };
      return res.status(500).send(errorMessage); // 500 Internal Server Error
    }

    if (!user) {
      const errorMessage = {
        message: "Unauthorized.",
        loginNeeded: true,
      };
      return res.status(401).send(errorMessage); // 401 Unauthorized
    }

    const userdata = {};
    user.forEach(attribute => {
      userdata[attribute.Name] = attribute.Value;
    });
    res.status(200).send(userdata); // 200 OK
  });
};

const uploadProflieImg = async (req, res) => {

  console.log("this is my uploda img api");
  const UserAttributes = [];

  console.log("this is ,y img", req.body.picture.base64EncodedData);
  const base64Data = req.body.picture.replace(/^data:image\/\w+;base64,/, '');
  const buf = Buffer.from(base64Data, 'base64');

  if (req.body.picture) {
    // Upload the profile picture to S3 and get the S3 URL
    const s3UploadParams = {
      Bucket: s3BucketName,
      Key: `profiles/${Date.now()}-${req.body.picture.name}.png`,
      Body: buf,
      ContentEncoding: 'base64',
    };



    try {
      const s3UploadResponse = await s3.upload(s3UploadParams).promise();
      const s3ImageUrl = s3UploadResponse.Location;

      UserAttributes.push({ Name: "picture", Value: s3ImageUrl });
    } catch (error) {
      console.error('Error uploading profile picture to S3:', error);
      return callback(null, { statusCode: 500, body: JSON.stringify({ message: 'Failed to upload profile picture to S3.' }) });
    }
  }



  const params = {
    AccessToken: req.headers.authorization,
    UserAttributes: UserAttributes,
  };

  UserService.updateUser(params, (err, response) => {
    if (err) {
      const errorMessage = {
        message: "Internal Server Error.",
        error: err,
      };
      return res.status(500).send(errorMessage);
    }
    const updatedUser = response;
    if (!updatedUser) {
      const notFoundMessage = {
        message: "User not found.",
      };
      return res.status(404).send(notFoundMessage); // 404 Not Found
    }
    const successMessage = {
      message: "updated successful.",
      user: response
    };
    res.status(200).send(successMessage);
  });
};




const updateUser = async (req, res) => {
  const UserAttributes = [];

  if (req.body.email) {
    UserAttributes.push({ Name: "email", Value: req.body.email });
  }
  if (req.body.name) {
    UserAttributes.push({ Name: "name", Value: req.body.name });
  }
  if (req.body.gender) {
    UserAttributes.push({ Name: "gender", Value: req.body.gender });
  }
  if (req.body.phone) {
    UserAttributes.push({ Name: "custom:phone", Value: req.body.phone });
  }
  if (req.body.picture) {
    UserAttributes.push({ Name: "picture", Value: req.body.picture });
  }

  const params = {
    AccessToken: req.headers.authorization,
    UserAttributes: UserAttributes,
  };

  UserService.updateUser(params, (err, response) => {
    if (err) {
      const errorMessage = {
        message: "Internal Server Error.",
        error: err,
      };
      return res.status(500).send(errorMessage);
    }
    const updatedUser = response;
    if (!updatedUser) {
      const notFoundMessage = {
        message: "User not found.",
      };
      return res.status(404).send(notFoundMessage); // 404 Not Found
    }
    const successMessage = {
      message: "updated successful.",
      user: response
    };
    res.status(200).send(successMessage);
  });
};

const getUser = (req, res) => {
  const params = {
    AccessToken: req.headers.authorization,
  };

  UserService.getUser(params, (err, response) => {
    if (err) {
      const errorMessage = {
        message: "Internal Server Error.",
        error: err,
      };
      res.status(500).send(errorMessage);
    } else {
      const user = {};
      response.forEach(attribute => {
        user[attribute.Name] = attribute.Value;
      });
      res.status(200).send(user);
    }
  });
};

const getAllUsers = (req, res) => {
  // Assuming you have a function in your UserService that retrieves all users
  const params = {
    UserPoolId: 'us-east-1_cQI5wZa9W'
  };
  UserService.getAllUsers(params, (err, users) => {
    if (err) {
      const errorMessage = {
        message: "Internal Server Error.",
        error: err,
      };
      res.status(500).send(errorMessage);
    } else {
      // Assuming users is an array of user objects
      res.status(200).send(users);
    }
  });
};

const getAll = (req, res) => {
  const params = {
    UserPoolId: 'us-east-1_cQI5wZa9W'
  };
  UserService.getAll(req, res, params)
    .then((combinedResponse) => {
      // Assuming users is an array of user objects
      res.status(200).send(combinedResponse);
    })
    .catch((err) => {
      const errorMessage = {
        message: "Internal Server Error.",
        error: err,
      };
      res.status(500).send(errorMessage);
    });
};


module.exports = {
  RegisterUser,
  VerifyUser,
  LoginUser,
  ForgotPassword,
  ResetPassword,
  verifyToken,
  signOut,
  deleteUser,
  updateUser,
  getUser,
  getAllUsers,
  uploadProflieImg,
  VerifyUserWithoutCode,
  getAll
};
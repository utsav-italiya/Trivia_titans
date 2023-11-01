const userService = require("../services/profileService");
const saveProfile = (req, res) => {
  const id = req.body.id;

  if (!id) {
    return res.status(400).json({ message: 'Missing required fields.....' });
  }

  const params = {
    id: req.body.id,
    totalGamePlayed: 0,
    win: 0,
    loss: 0,
    totalPoints: 0,
    achievements: "none",
  };

  userService.saveUserProfile(params, (err, user) => {
    if (err) {
      const errorMessage = {
        message: "Internal Server Error.",
        error: err,
      };
      res.status(500).json(errorMessage);
    } else {
      res.status(200).json(user); // Include status code 200
    }
  });
};

const getProfileData = (req, res) => {
  const userId = req.body.id;

  if (!userId) {
    return res.status(400).json({ message: 'Missing required fields.....' });
  }

  userService.getProfileData(userId, (err, profileData) => {
    if (err) {
      const errorMessage = {
        message: 'Internal Server Error.',
        error: err,
      };
      res.status(500).json(errorMessage);
    } else {
      res.status(200).json(profileData); // Include status code 200
    }
  });
};

const getAllprofiles = (req, res) => {  
  userService.getAllprofiles((err, profileData) => {
    if (err) {
      const errorMessage = {
        message: 'Internal Server Error......',
        error: err,
      };
      res.status(500).json(errorMessage);
    } else {
      res.status(200).json(profileData); // Include status code 200
    }
  });
};

const updateProfile = (req, res) => {
  const userId = req.body.id;
  const updatedData = req.body; 
  if (!userId) {
    return res.status(400).json({ message: 'Missing required fields.....' });
  }

  userService.updateProfile(userId, updatedData, (err, updatedProfile) => {
    if (err) {
      const errorMessage = {
        message: 'Internal Server Error.',
        error: err,
      };
      res.status(500).json(errorMessage);
    } else {
      res.status(200).json(updatedProfile); // Include status code 200
    }
  });
};

module.exports = {
  saveProfile,
  getProfileData,
  updateProfile,
  getAllprofiles
};

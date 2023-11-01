const express = require('express');

const profileController = require('../controllers/profileController');

const router = express.Router();

router.post('/save-user', profileController.saveProfile);
router.post('/get-game-data', profileController.getProfileData);
router.post('/update-game-data', profileController.updateProfile);
router.get('/get-all-profile', profileController.getAllprofiles);


module.exports = router;

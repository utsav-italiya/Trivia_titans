const express = require('express');

const UserController = require('../controllers/userController');

const router = express.Router();

router.post('/register', UserController.RegisterUser);
router.post('/verify', UserController.VerifyUser);
router.post('/login', UserController.LoginUser);
router.post('/forgot-password', UserController.ForgotPassword);
router.post('/reset-password', UserController.ResetPassword);
router.post("/verify-token", UserController.verifyToken);
router.post("/verify-email-withoutcode", UserController.VerifyUserWithoutCode);
router.post("/update-user", UserController.updateUser);
router.post("/upload-profile-photo", UserController.uploadProflieImg);
router.get("/get-user", UserController.getUser);
router.get("/signout", UserController.signOut);
router.get("/delete-user", UserController.deleteUser);
router.get("/get-all-users", UserController.getAllUsers);
router.get("/get-all", UserController.getAll);


module.exports = router;



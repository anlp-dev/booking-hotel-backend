const express = require('express');
const router = express.Router();
const ProfileControllers = require('../../controllers/user/Profile.controller');

router.get('/profile', ProfileControllers.getProfile);
router.get('/profile/:id', ProfileControllers.getProfileById);
router.put('/updateProfile', ProfileControllers.updateProfile);
module.exports = router; 

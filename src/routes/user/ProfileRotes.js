const express = require('express');
const router = express.Router();
const ProfileControllers = require('../../controllers/user/ProfileControllers');

router.get('/', ProfileControllers.getProfile);
router.get('/:id', ProfileControllers.getProfileById);
router.put('/updateProfile', ProfileControllers.updateProfile);
module.exports = router; 

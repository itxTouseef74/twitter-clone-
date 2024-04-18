// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController.js')


router.post('/login', userController.login)
router.post('/register', userController.register);
router.post('/getuserwithoutdetail', userController.getuserwithoutdetail);
router.post('/getuserwithdetails', userController.getuserwithdetails);
router.post('/updateuser', userController.updateuser);



module.exports = router;

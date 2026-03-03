const express = require('express');
const { register, login, getUsers, updateTeam, deleteTeam } = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers); 


router.put('/teams/:id', verifyToken, isAdmin, updateTeam);
router.delete('/teams/:id', verifyToken, isAdmin, deleteTeam);

module.exports = router;

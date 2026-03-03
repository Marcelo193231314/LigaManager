const express = require('express');
const { getTeams } = require('../controllers/teamsController');

const router = express.Router();

router.get('/', getTeams);

module.exports = router;

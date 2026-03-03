const express = require('express');

const { getMatches, createMatch, updateMatchStatus } = require('../controllers/matchesController');

const router = express.Router();

router.get('/', getMatches);
router.post('/', createMatch);
router.patch('/:id/status', updateMatchStatus);

module.exports = router;

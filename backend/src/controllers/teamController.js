const pool = require('../config/db');

const getTeams = async (req, res) => {
    try {
        const [teams] = await pool.query('SELECT id, name FROM teams ORDER BY name ASC');
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getTeams };

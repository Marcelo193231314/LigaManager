const pool = require('../config/db');

const getMatches = async (req, res) => {
    try {
        const query = `
            SELECT 
                m.id, 
                t1.name AS local_team_name, 
                t2.name AS visitor_team_name, 
                m.match_date, 
                m.location, 
                m.status,
                m.local_score,
                m.visitor_score
            FROM matches m
            JOIN teams t1 ON m.local_team_id = t1.id
            JOIN teams t2 ON m.visitor_team_id = t2.id
            ORDER BY m.match_date ASC
        `;
        const [matches] = await pool.query(query);
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createMatch = async (req, res) => {
    try {
        const { local_team_id, visitor_team_id, match_date, location } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO matches (local_team_id, visitor_team_id, match_date, location, status) VALUES (?, ?, ?, ?, ?)',
            [local_team_id, visitor_team_id, match_date, location, 'Pendiente']
        );
        
        res.status(201).json({ message: 'Partido creado exitosamente', matchId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMatchStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, local_score, visitor_score } = req.body;
        
        await pool.query(
            'UPDATE matches SET status = ?, local_score = ?, visitor_score = ? WHERE id = ?', 
            [status, local_score || 0, visitor_score || 0, id]
        );
        
        res.json({ message: 'Resultado y estado actualizados correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getMatches, createMatch, updateMatchStatus };

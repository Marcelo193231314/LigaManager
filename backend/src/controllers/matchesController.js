const pool = require('../config/db');


const getMatches = async (req, res) => {
    try {
        const query = `
            SELECT 
                m.id, 
                IFNULL(t1.name, 'Equipo Desconocido') AS local_team_name, 
                IFNULL(t2.name, 'Equipo Desconocido') AS visitor_team_name, 
                m.match_date, 
                m.location, 
                IFNULL(m.status, 'Pendiente') AS status,
                IFNULL(m.local_score, 0) AS local_score,
                IFNULL(m.visitor_score, 0) AS visitor_score
            FROM matches m
            LEFT JOIN teams t1 ON m.local_team_id = t1.id
            LEFT JOIN teams t2 ON m.visitor_team_id = t2.id
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
        
        const defaultStatus = 'Pendiente';
        const defaultScore = 0;

        const [result] = await pool.query(
            'INSERT INTO matches (local_team_id, visitor_team_id, match_date, location, status, local_score, visitor_score) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [local_team_id, visitor_team_id, match_date, location, defaultStatus, defaultScore, defaultScore]
        );
        res.status(201).json({ message: 'Partido creado', matchId: result.insertId });
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
        
        res.json({ message: 'Marcador y estado actualizados' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getMatches, createMatch, updateMatchStatus };

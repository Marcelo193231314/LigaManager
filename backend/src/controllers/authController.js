const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password, adminSecret } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        let userRole = 'user';
        const SECRET_CODE = 'ViscaBarca'; 

        
        if (adminSecret !== undefined && adminSecret !== '') {
            if (adminSecret === SECRET_CODE) {
                userRole = 'admin'; 
            } else {
                return res.status(403).json({ error: 'Código secreto incorrecto. Registro denegado.' });
            }
        }
        
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, userRole]
        );
        
        
        if (userRole === 'user') {
            await pool.query(
                'INSERT INTO teams (name, captain_id) VALUES (?, ?)',
                [name, result.insertId]
            );
        }
        
        res.status(201).json({ message: 'Registro exitoso', userId: result.insertId, role: userRole });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        if (role && user.role !== role) {
            return res.status(403).json({ message: `Acceso denegado. No tienes permisos de ${role}.` });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const [teams] = await pool.query("SELECT id, name FROM teams");
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        await pool.query('UPDATE teams SET name = ? WHERE id = ?', [name, id]);
        res.json({ message: 'Nombre del equipo actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;
        
        
        await pool.query('DELETE FROM matches WHERE local_team_id = ? OR visitor_team_id = ?', [id, id]);
        
        await pool.query('DELETE FROM teams WHERE id = ?', [id]);
        
        res.json({ message: 'Equipo y sus partidos eliminados correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login, getUsers, updateTeam, deleteTeam };

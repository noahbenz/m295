import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = 'mysecretkey-295-noah';
const VALID_PASSWORD = 'm295';

// Regex copied
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; //https://emaillistvalidation.com/blog/email-validation-in-javascript-using-regular-expressions-the-ultimate-guide/

const saveUserToSession = (req, res, next) => {
    const { email } = req.body;
    req.session.email = email; // Save user email to session
    next();
};

// Login-Endpunkt /POST
router.post('/login', saveUserToSession, (req, res) => {
    // #swagger.tags = ['Auth']
    const { email, password } = req.body;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password === VALID_PASSWORD) {
        const token = jwt.sign({ email }, SECRET_KEY);
        req.session.token = token; // Save token to session
        res.status(200).json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Verify-Endpunkt /GET
router.get('/verify', (req, res) => {
    // #swagger.tags = ['Auth']
    const token = req.session.token; // Get token back from session
    if (!token) {
        return res.status(401).json({ error: 'No session found' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid session' });
        }
        res.status(200).json({ email: user.email });
    });
});

// Logout-Endpunkt /DELETE
router.delete('/logout', (req, res) => {
    // #swagger.tags = ['Auth']
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

export default router;

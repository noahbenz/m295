import express from 'express';
const app = express();
import basicAuth from 'express-basic-auth';

// Benutzerdaten
const users = {
  'zli': 'zli1234'
};

// Middleware für Basic Auth
app.use('/private', basicAuth({
    users: users,
    challenge: true // Browser Login Dialog aktivieren
}));

// Öffentliche Route
app.get('/public', (req, res) => {
  res.send('Dies ist eine öffentliche Route.');
});

// Private Route
app.get('/private', (req, res) => {
  res.send('Dies ist eine private Route.');
});

// Server starten
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

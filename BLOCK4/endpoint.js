import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));

// Sample data for names
let namesList = [];

app.use(bodyParser.json());

// GET /now endpoint
app.get('/now', (req, res) => {
    const tz = req.query.tz || 'UTC';
    const date = new Date().toLocaleString('de-CH', { timeZone: tz });
    res.send(`Current time in ${tz}: ${date}`);
});

// GET /names endpoint
app.get('/names', (req, res) => {
    res.sendFile(path.join(__dirname, 'create_name.html'));
});

// POST /names endpoint
app.post('/names', (req, res) => {
    const name = req.body.name;
    if (!name) {
        return res.status(400).send('Name is required');
    }
    namesList.push(name);
    res.status(201).json(namesList);
});

// DELETE /names endpoint
app.delete('/names', (req, res) => {
    const name = req.query.name;
    if (!name) {
        return res.status(400).send('Name query parameter is required');
    }
    namesList = namesList.filter(item => item !== name);
    res.sendStatus(204);
});

// GET /secret2 endpoint
app.get('/secret2', (req, res) => {
    const key = "Basic aGFja2VyOjEyMzQ=";

    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== key) {
        return res.status(401).send('Unauthorized');
    }
    res.sendStatus(200);
});

// GET /chuck endpoint
app.get('/chuck', async (req, res) => {
    const name = req.query.name;
    try {
        const chuckResponse = await axios.get('https://api.chucknorris.io/jokes/random');
        let joke = chuckResponse.data.value;
        if (name) {
            joke = joke.replace(/Chuck Norris/g, name);
        }
        res.send(joke);
    } catch (error) {
        res.status(500).send('Failed to fetch Chuck Norris joke');
    }
});

let me = {
    firstName: 'Noah',
    lastName: 'Benz',
    age: 17,
    city: 'Beringen',
    eyeColor: 'green'
};

// PATCH /me endpoint
app.patch('/me', (req, res) => {
    const updatedFields = req.body;
    for (const key in updatedFields) {
        if (me.hasOwnProperty(key)) {
            me[key] = updatedFields[key];
        }
    }

    res.json(me);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
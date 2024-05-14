import express, { response } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Endpunkt: /now -> WORKS
app.get('/now', (request, response) => {
    response.json({ time: new Date().toISOString() });
});

// Endpunkt: /zli -> WORKS
app.get('/zli', (request, response) => {
    response.redirect('https://zli.ch');
});

// Endpunkt: /name -> WORKS
app.get('/name', (request, response) => {
    const names = ['Max', 'Tim', 'Noah', 'Emma', 'Till', 'Louis', 'Elijah', 'Manuel', 'William', 'Sophia', 'James', 'Joel', 'Micha', 'Timber', 'Lucas', 'Colin', 'Henry', 'Evelyn', 'Alexander', 'Harper'];
    response.json({ name: names[Math.floor(Math.random() * names.length)] });
});

// Endpunkt: /html -> WORKS
app.get('/html', (request, response) => {
    response.sendFile(path.join(__dirname, 'file.html'));
});

// Endpunkt: /image -> WORKS
app.get('/image', (request, response) => {
    response.sendFile(path.join(__dirname, 'image.png'));
});

// Endpunkt: /teapot -> WORKS
app.get('/teapot', (request, response) => {
    response.status(418).send("I'm a teapot");
});

// Endpunkt: /user-agent -> WORKS
app.get('/user-agent', (request, response) => {
    const userAgent = request.headers['user-agent'];
    response.send(`User Agent: ${userAgent}`);
});

// Endpunkt: /secret -> WORKS
app.get('/secret', (request, response) => {
    response.sendStatus(403);
});

// Endpunkt: /xml -> WORKS
app.get('/xml', (request, response) => {
    response.sendFile(path.join(__dirname, 'file.xml'));
});

// Endpunkt: /me -> WORKS
app.get('/me', (request, response) => {
    const me = {
        firstName: 'Noah',
        lastName: 'Benz',
        age: 17,
        city: 'Beringen',
        eyeColor: 'green'
    };
    response.json(me);
});

// Own Endpoint to Test
app.get('/test', (_, response) => {
    const test = 'test';
    response.send(test);
})

app.get('/2test', (request, response) => {
    const lan = request.headers['accept-language']
    response.send(lan)
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

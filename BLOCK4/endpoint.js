const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
const fetch = require('node-fetch'); // Hinzugefügt

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET /now Endpoint
app.get('/now', (req, res) => {
  const timezone = req.query.tz || 'UTC';
  const currentTime = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
  res.status(200).send({ current_time: currentTime });
});

// POST /names Endpoint
let namesList = [];
app.post('/names', (req, res) => {
  const newName = req.body.name;
  namesList.push(newName);
  res.status(201).send({ message: 'Name added successfully' });
});

// DELETE /names Endpoint
app.delete('/names', (req, res) => {
  const nameToRemove = req.query.name;
  namesList = namesList.filter(name => name !== nameToRemove);
  res.status(204).send();
});

// GET /secret2 Endpoint
app.get('/secret2', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader === 'Basic aGFja2VyOjEyMzQ=') {
    res.status(200).send({ message: 'Authorization successful' });
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
});

// GET /chuck Endpoint
app.get('/chuck', async (req, res) => {
  try {
    const chuckNorrisAPI = 'https://api.chucknorris.io/jokes/random';
    const name = req.query.name || 'Chuck Norris';
    const response = await fetch(`${chuckNorrisAPI}?name=${name}`);
    const jokeData = await response.json();
    const joke = jokeData.value.replace('Chuck Norris', name);
    res.status(200).send({ joke });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// PATCH /me Endpoint
let meObject = {};
app.patch('/me', (req, res) => {
  meObject = { ...meObject, ...req.body };
  res.status(200).send({ message: 'Object updated successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

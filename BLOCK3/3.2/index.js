const express = require('express');

const app = express();
const port = 3000;

app.get('/weather/:plz', async (request, response) => {
  try {
    const fetch = await import('node-fetch');
    const res = await fetch.default(`https://app-prod-ws.meteoswiss-app.ch/v1/plzDetail?plz=${request.params.plz}00`);
    const data = await res.json();
    response.json(data.currentWeather.temperature);
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    response.status(500).json({ error: 'Interner Serverfehler' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

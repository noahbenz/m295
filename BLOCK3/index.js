const express = require('express');
const request = require('request');

const app = express();

app.get('/temperature', (req, res) => {
  const plz = req.query.plz;
  
  if (!plz) {
    return res.status(400).json({ error: 'Postleitzahl fehlt' });
  }
  
  const apiUrl = `https://app-prod-ws.meteoswiss-app.ch/v1/plzDetail?plz=${plz}`;
  
  request.get(apiUrl, (err, response, body) => {
    if (err) {
      return res.status(500).json({ error: 'Ein Fehler ist aufgetreten' });
    }
    
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ error: 'Ungültige Antwort vom Server' });
    }
    
    const data = JSON.parse(body);
    const temperature = data.temperature;
    res.json({ temperature });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

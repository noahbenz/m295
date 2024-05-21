import express from 'express';
import session from 'express-session';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

app.post('/name', (req, res) => {
    const name = req.body.name;
    if (name) {
        req.session.name = name;
        res.status(200).send(`Name saved in session.`);
    } else {
        res.status(400).send('Name parameter is missing.');
    }
});

app.get('/name', (req, res) => {
    if (req.session.name) {
        res.status(200).send(req.session.name);
    } else {
        res.status(404).send('No name found in session.');
    }
});

app.delete('/name', (req, res) => {
    if (req.session.name) {
        delete req.session.name;
        res.status(200).send('Name deleted from session.');
    } else {
        res.status(404).send('No name found in session.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
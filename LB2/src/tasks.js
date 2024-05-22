import express from 'express';
import { nanoid } from 'nanoid';
import cors from 'cors';
import session from 'express-session';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;
const SECRET_KEY = 'mysecretkey-295-noah'; 
const VALID_PASSWORD = 'm295';
// Imports copied from task 7.3 
// Most of the tasks were done with the task from 7.3

// Middleware-Funktionen -> authorize for every request
const authorizeUser = (req, res, next) => {
    const token = req.session.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. Please login first.' });
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid session. Please login again.' });
        }
        req.decoded = decoded;
        next();
    });
};

const saveUserToSession = (req, res, next) => {
    const { email } = req.body;
    req.session.email = email; // Save user email to session
    next();
};

// Session-Konfiguration
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// Regex copied 
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; //https://emaillistvalidation.com/blog/email-validation-in-javascript-using-regular-expressions-the-ultimate-guide/

// Login-Endpunkt /POST
app.post('/login', saveUserToSession, (req, res) => {
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
app.get('/verify', (req, res) => {
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
app.delete('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Alle Tasks
const tasks = [
    { id: nanoid(), title: 'Noahs Task', description: 'Bring out the garbage!', doneAt: null, creator: 'Noah Benz' },
    { id: nanoid(), title: 'Toms Task', description: 'Clean the kitchen!', doneAt: null, creator: 'Tom Benz' },
    { id: nanoid(), title: 'Jasons Task', description: 'Feed the pets!', doneAt: null, creator: 'Jason Benz' },
];

// Tasks-Endpoints
// Get all tasks /GET 
app.get('/tasks', authorizeUser, (req, res) => {
    res.status(200).json(tasks);
});

// Create new task /POST 
app.post('/tasks', authorizeUser,  (req, res) => {
    if (!req.body.title || !req.body.description || req.body.doneAt === undefined) {
        return res.status(400).json({ error: 'Title, description, and doneAt are required' });
    }

    const { title, description, doneAt } = req.body;
    const creator = req.session.email; // Get Email from session

    const newTask = {
        id: nanoid(),
        title,
        description,
        doneAt: doneAt === true ? new Date() : false,
        creator
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});
// Get task with id /GET
app.get('/tasks/:id', authorizeUser, (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
});

// Edit task with id /PUT
app.put('/tasks/:id', authorizeUser, (req, res) => {
    const { title, description, doneAt, creator } = req.body;
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    tasks[taskIndex] = { ...tasks[taskIndex], title, description, doneAt, creator };
    res.status(200).json(tasks[taskIndex]);
});

// Delete task with id /DELETE
app.delete('/tasks/:id', authorizeUser,  (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const deletedTask = tasks.splice(taskIndex, 1)[0];

    const response = {
        task: deletedTask,
        message: 'Attention - This task has been removed by you!'
    };
    res.status(200).json(response);
});

// Error-Handling-Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

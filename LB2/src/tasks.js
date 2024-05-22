import express from 'express';
import { nanoid } from 'nanoid';
import cors from 'cors';
import session from 'express-session';
import { fileURLToPath } from 'url';
import path from 'path';
// Imports copied from task 7.3
const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));
// creator -> email von dem der sich identifiziert
const tasks = [
    { id: nanoid(), title: 'Noahs Task', description: 'Bring out the garbage!', doneAt: null, creator: 'Noah Benz' },
    { id: nanoid(), title: 'Toms Task', description: 'Clean the kitchen!', doneAt: null, creator: 'Tom Benz' },
    { id: nanoid(), title: 'Jasons Task', description: 'Feed the pets!', doneAt: null, creator: 'Jason Benz' },
];

// GET /tasks endpoint -> A1 [x]
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// POST /tasks endpoint -> A2 [x]
app.post('/tasks', (req, res) => {
    const { title, description, doneAt, creator } = req.body;
    const newTask = { id: nanoid(),
         title,
         description,
         doneAt: doneAt === true ? new Date() : false, // Asked chat gpt how to add current date (Decide of done or not in a post)
         creator }; 
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// GET /tasks/:id endpoint -> A3 [x]
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
});

// PUT /tasks/:id endpoint -> A4 [x]
app.put('/tasks/:id', (req, res) => {
    const { title, description, doneAt, creator } = req.body;
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    tasks[taskIndex] = { ...tasks[taskIndex], title, description, doneAt, creator };
    res.status(200).json(tasks[taskIndex]);
});

// DELETE /tasks/:id endpoint -> A5 [x]
app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.status(200).json(deletedTask);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

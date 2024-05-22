import express from 'express';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';

const router = express.Router();
const tasks = [
    { id: nanoid(), title: 'Noahs Task', description: 'Bring out the garbage!', doneAt: null, creator: 'Noah Benz' },
    { id: nanoid(), title: 'Toms Task', description: 'Clean the kitchen!', doneAt: null, creator: 'Tom Benz' },
    { id: nanoid(), title: 'Jasons Task', description: 'Feed the pets!', doneAt: null, creator: 'Jason Benz' },
];
const SECRET_KEY = 'mysecretkey-295-noah';

// Middleware function to authorize user
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

// Get all tasks
router.get('/', authorizeUser, (req, res) => {
    // #swagger.tags = ['Tasks']
    res.status(200).json(tasks);
});

// Create new task
router.post('/', authorizeUser, (req, res) => {
    // #swagger.tags = ['Tasks']
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

// Get task with id
router.get('/:id', authorizeUser, (req, res) => {
    // #swagger.tags = ['Tasks']
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
});

// Edit task with id
router.put('/:id', authorizeUser, (req, res) => {
    // #swagger.tags = ['Tasks']
    const { title, description, doneAt, creator } = req.body;
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    tasks[taskIndex] = { ...tasks[taskIndex], title, description, doneAt, creator };
    res.status(200).json(tasks[taskIndex]);
});

// Delete task with id
router.delete('/:id', authorizeUser, (req, res) => {
    // #swagger.tags = ['Tasks']
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

export default router;

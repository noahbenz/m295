import express from 'express';
import { nanoid } from 'nanoid'
import cors from 'cors';
import session from 'express-session';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const port = 3000;

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));

const books = [
    { isbn: 1, title: 'The Catcher in the Rye', year: 1951, author: 'J.D. Salinger' },
    { isbn: 2, title: 'To Kill a Mockingbird', year: 1960, author: 'Harper Lee' },
    { isbn: 3, title: '1984', year: 1949, author: 'George Orwell' },
    { isbn: 4, title: 'The Great Gatsby', year: 1925, author: 'F. Scott Fitzgerald' },
];

const lends = [
    { id: nanoid(), customer_id: 1, isbn: 1, borrowed_at: '2021-01-01', returned_at: '2021-01-15' },
    { id: nanoid(), customer_id: 2, isbn: 2, borrowed_at: '2021-01-02', returned_at: '2021-01-16' },
    { id: nanoid(), customer_id: 3, isbn: 3, borrowed_at: '2021-01-03', returned_at: '2021-01-17' },
    { id: nanoid(), customer_id: 4, isbn: 4, borrowed_at: '2021-01-04', returned_at: '2021-01-18' },
];

// function check if the user is authenticated
const auth = (req, res, next) => {
    if (!req.session.authenticated) {
        return res.sendStatus(401);
    }
    next();
}

const guest = (req, res, next) => {
    if (req.session.authenticated) {
        return res.sendStatus(403);
    }
    next();
}

// POST /login endpoint
app.post('/login', (req, res) => {
    // #swagger.tags = ['Session']
    const email = req.body.email;
    const password = req.body.password;
    if (email === 'desk@library.example' && password === 'm295') {
        req.session.authenticated = true;
        req.session.email = email;
        res.status(201).send({ email: req.session.email });
    } else {
        res.sendStatus(401);
    }
});

// GET /login endpoint
app.get('/login', guest, (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// GET /verify endpoint
app.get('/verify', (req, res) => {
    // #swagger.tags = ['Session']
    if (req.session.authenticated) {
        res.status(200).send({ email: req.session.email });
    } else {
        res.sendStatus(401);
    }
});

// DELETE /logout endpoint
app.delete('/logout', (req, res) => {
    // #swagger.tags = ['Session']
    req.session.destroy();
    res.sendStatus(204);
});

// GET /books endpoint
app.get('/books', (req, res) => {
    // #swagger.tags = ['Books']
    res.json(books);
});

// GET /books/:isbn endpoint
app.get('/books/:isbn', (req, res) => {
    // #swagger.tags = ['Books']
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn == isbn);
    if (!book) {
        return res.status(404).send('Book not found');
    }
    res.json(book);
});

// POST /books endpoint
app.post('/books', (req, res) => {
    // #swagger.tags = ['Books']
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new book.',
        schema: {
            $isbn: '',
            $title: '',
            $year: '',
            $author: ''
        }
    } */
    const book = req.body;
    if (!validateBookData(book)) {
        return res.status(422).send('Invalid book data');
    }
    books.push(book);
    res.status(201).json(book);
});

// PUT /books/:isbn endpoint
app.put('/books/:isbn', (req, res) => {
    // #swagger.tags = ['Books']
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update book.',
        schema: {
            $isbn: '',
            $title: '',
            $year: '',
            $author: ''
        }
    } */
    const isbn = req.params.isbn;
    const book = req.body;
    if (!validateBookData(book)) {
        return res.status(422).send('Invalid book data');
    }
    const index = books.findIndex(b => b.isbn == isbn);
    console.log(index);
    if (index === -1) {
        return res.status(404).send('Book not found');
    }
    books[index] = book;
    res.json(book);
});

// DELETE /books/:isbn endpoint
app.delete('/books/:isbn', (req, res) => {
    // #swagger.tags = ['Books']
    const isbn = req.params.isbn;
    const index = books.findIndex(b => b.isbn == isbn);
    if (index === -1) {
        return res.status(404).send('Book not found');
    }
    books.splice(index, 1);
    res.sendStatus(204);
});

// PATCH /books/:isbn endpoint
app.patch('/books/:isbn', (req, res) => {
    // #swagger.tags = ['Books']
    const isbn = req.params.isbn;
    const updatedFields = req.body;
    const index = books.findIndex(b => b.isbn == isbn);
    if (index === -1) {
        return res.status(404).send('Book not found');
    }
    books[index] = { ...books[index], ...updatedFields };
    res.json(books[index]);
});

function validateBookData(book) {
    if (!book.isbn || !book.title || !book.year || !book.author) {
        return false;
    }
    return true;
}

// GET /lends endpoint
app.get('/lends', auth, (req, res) => {
    // #swagger.tags = ['Lends']
    res.json(lends);
});

// GET /lends/:id endpoint
app.get('/lends/:id', auth, (req, res) => {
    // #swagger.tags = ['Lends']
    const id = req.params.id;
    const lend = lends.find(l => l.id == id);
    if (!lend) {
        return res.status(404).send('Lend not found');
    }
    res.json(lend);
});

// POST /lends endpoint
app.post('/lends', auth, (req, res) => {
    // #swagger.tags = ['Lends']
    const lend = req.body;
    if (!validateLendData(lend)) {
        return res.status(422).send('Invalid lend data');
    }

    if(lends.find(l => l.isbn == lend.isbn && l.returned_at == null)) {
        return res.status(409).send('Book is already lent');
    }

    if(lends.filter(l => l.customer_id == lend.customer_id && l.returned_at == null).length >= 3) {
        return res.status(409).send('Customer has already lent 3 books');
    }

    const existedLend = lends.find(l => l.isbn == lend.isbn && l.returned_at != null);
    if(existedLend) {
        existedLend.returned_at = null;
        existedLend.customer_id = lend.customer_id;
        return res.status(201).json(existedLend);
    }

    const newLend = { 
        id: nanoid(),
        customer_id: lend.customer_id,
        isbn: lend.isbn,
        borrowed_at: new Date(),
        returned_at: null
    };

    lends.push(newLend);
    res.status(201).json(newLend);
});

// DELETE /lends/:id endpoint
app.delete('/lends/:id', auth, (req, res) => {
    // #swagger.tags = ['Lends']
    const id = req.params.id;
    const index = lends.findIndex(l => l.id == id);
    if (index === -1) {
        return res.status(404).send('Lend not found');
    }
    lends[index] = { ...lends[index], returned_at: new Date() };
    res.sendStatus(204);
});

function validateLendData(lend) {
    // #swagger.tags = ['Lends']
    if (!lend.customer_id || !lend.isbn) {
        return false;
    }
    return true;
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
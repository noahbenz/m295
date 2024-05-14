import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const books = [
    { isbn: 1, title: 'The Catcher in the Rye', year: 1951, author: 'J.D. Salinger' },
    { isbn: 2, title: 'To Kill a Mockingbird', year: 1960, author: 'Harper Lee' },
    { isbn: 3, title: '1984', year: 1949, author: 'George Orwell' },
    { isbn: 4, title: 'The Great Gatsby', year: 1925, author: 'F. Scott Fitzgerald' },
];

// GET /books endpoint
app.get('/books', (req, res) => {
    res.json(books);
});

// GET /books/:isbn endpoint
app.get('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn == isbn);
    if (!book) {
        return res.status(404).send('Book not found');
    }
    res.json(book);
});

// POST /books endpoint
app.post('/books', (req, res) => {
    const book = req.body;
    if (!validateBookData(book)) {
        return res.status(400).send('Invalid book data');
    }
    books.push(book);
    res.status(201).json(book);
});

// PUT /books/:isbn endpoint
app.put('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = req.body;
    if (!validateBookData(book)) {
        return res.status(400).send('Invalid book data');
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
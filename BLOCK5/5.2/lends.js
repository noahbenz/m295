import express from 'express';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const books = [
    { isbn: 1, title: 'The Catcher in the Rye', year: 1951, author: 'J.D. Salinger' },
    { isbn: 2, title: 'To Kill a Mockingbird', year: 1960, author: 'Harper Lee' },
    { isbn: 3, title: '1984', year: 1949, author: 'George Orwell' },
    { isbn: 4, title: 'The Great Gatsby', year: 1925, author: 'F. Scott Fitzgerald' },
];

const lends = [
    { id: 1, customer_id: 1, isbn: 1, borrowed_at: '2021-01-01', returned_at: '2021-01-15' },
    { id: 2, customer_id: 2, isbn: 2, borrowed_at: '2021-01-02', returned_at: '2021-01-16' },
    { id: 3, customer_id: 3, isbn: 3, borrowed_at: '2021-01-03', returned_at: '2021-01-17' },
    { id: 4, customer_id: 4, isbn: 4, borrowed_at: '2021-01-04', returned_at: '2021-01-18' },
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
        return res.status(422).send('Invalid book data');
    }
    books.push(book);
    res.status(201).json(book);
});

// PUT /books/:isbn endpoint
app.put('/books/:isbn', (req, res) => {
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

// GET /lends endpoint
app.get('/lends', (req, res) => {
    res.json(lends);
});

// GET /lends/:id endpoint
app.get('/lends/:id', (req, res) => {
    const id = req.params.id;
    const lend = lends.find(l => l.id == id);
    if (!lend) {
        return res.status(404).send('Lend not found');
    }
    res.json(lend);
});

// POST /lends endpoint
app.post('/lends', (req, res) => {
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
        id: lends.length + 1,
        customer_id: lend.customer_id,
        isbn: lend.isbn,
        borrowed_at: new Date(),
        returned_at: null
    };

    lends.push(newLend);
    res.status(201).json(newLend);
});

// DELETE /lends/:id endpoint
app.delete('/lends/:id', (req, res) => {
    const id = req.params.id;
    const index = lends.findIndex(l => l.id == id);
    if (index === -1) {
        return res.status(404).send('Lend not found');
    }
    lends[index] = { ...lends[index], returned_at: new Date() };
    res.sendStatus(204);
});

function validateLendData(lend) {
    if (!lend.customer_id || !lend.isbn) {
        return false;
    }
    return true;
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
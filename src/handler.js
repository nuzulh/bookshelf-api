const { nanoid } = require('nanoid');
const books = require('./data/books');

const addBookHandler = (req, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    if (name === undefined) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        res.code(400);
        return res;
    } else if (readPage > pageCount) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        res.code(400);
        return res;
    } else {
        books.push(newBook);
        const isSuccess = books.filter((book) => book.id === id).length > 0;

        if (isSuccess) {
            const res = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            });
            res.code(201);
            return res;
        }

        const res = h.response({
            status: 'fail',
            message: 'Buku gagal ditambahkan',
        });
        res.code(500);
        return res;
    }
};

const getAllBooksHandler = (req, h) => {
    const { name, reading, finished } = req.query;

    if (name !== undefined) {
        const booksByName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
            .map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    publisher: item.publisher,
                };
            });
        const res = h.response({
            status: 'success',
            data: {
                books: booksByName,
            },
        });
        res.code(200);
        return res;
    }
    if (reading !== undefined) {
        let booksByReading = [];
        if (reading === '0') {
            booksByReading = books.filter((book) => book.reading === false)
                .map((item) => {
                    return {
                        id: item.id,
                        name: item.name,
                        publisher: item.publisher,
                    };
                });
        } else if (reading === '1') {
            booksByReading = books.filter((book) => book.reading === true)
                .map((item) => {
                    return {
                        id: item.id,
                        name: item.name,
                        publisher: item.publisher,
                    };
                });
        } else {
            booksByReading = [...books];
        }
        const res = h.response({
            status: 'success',
            data: {
                books: booksByReading,
            },
        });
        res.code(200);
        return res;
    }
    if (finished !== undefined) {
        let booksByFinished = [];
        if (finished === '0') {
            booksByFinished = books.filter((book) => book.finished === false)
                .map((item) => {
                    return {
                        id: item.id,
                        name: item.name,
                        publisher: item.publisher,
                    };
                });
        } else if (finished === '1') {
            booksByFinished = books.filter((book) => book.finished === true)
                .map((item) => {
                    return {
                        id: item.id,
                        name: item.name,
                        publisher: item.publisher,
                    };
                });
        } else {
            booksByFinished = [...books];
        }
        const res = h.response({
            status: 'success',
            data: {
                books: [...booksByFinished],
            },
        });
        res.code(200);
        return res;
    }

    const allBooks = books.map((book) => {
        return {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        };
    });

    const res = h.response({
        status: 'success',
        data: {
            books: allBooks,
        },
    });
    res.code(200);
    return res;
};

const getBookHandler = (req, h) => {
    const { bookId } = req.params;
    const book = books.filter((item) => item.id === bookId)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const res = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    res.code(404);
    return res;
};

const updateBookHandler = (req, h) => {
    const { bookId } = req.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.payload;

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    if (name === undefined) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        res.code(400);
        return res;
    } else if (readPage > pageCount) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        res.code(400);
        return res;
    } else {
        const index = books.findIndex((book) => book.id === bookId);

        if (index !== -1) {
            books[index] = {
                ...books[index],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading,
                finished,
                updatedAt,
            };

            const res = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui',
            });
            res.code(200);
            return res;
        }

        const res = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        res.code(404);
        return res;
    }
};

const deleteBookHandler = (req, h) => {
    const { bookId } = req.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        return {
            status: 'success',
            message: 'Buku berhasil dihapus',
        };
    }

    const res = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    res.code(404);
    return res;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookHandler,
    updateBookHandler,
    deleteBookHandler,
};

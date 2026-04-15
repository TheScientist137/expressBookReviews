const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
// Get the book list using Promise callbacks
public_users.get('/promise/books', function(req, res) {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Unable to retrieve books");
    }
  })
    .then((books) => {
      return res.status(200).json(JSON.stringify(books));
    })
    .catch((err) => {
      return res.status(500).json({ message: err });
    });
});

// Get book details based on ISBN
// Get book details based on ISBN using Promise callbacks
public_users.get('/promise/isbn/:isbn', function(req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Get book details based on author
// Get book details based on Author using Promise callbacks
public_users.get('/promise/author/:author', function(req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    const matchingBooks = [];

    bookKeys.forEach((key) => {
      if (books[key].author === author) {
        matchingBooks.push(books[key]);
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found for that author");
    }
  })
    .then((matchingBooks) => {
      return res.status(200).json(matchingBooks);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Get all books based on title
// Get book details based on Title using Promise callbacks
public_users.get('/promise/title/:title', function(req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    const matchingBooks = [];

    bookKeys.forEach((key) => {
      if (books[key].title === title) {
        matchingBooks.push(books[key]);
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found with that title");
    }
  })
    .then((matchingBooks) => {
      return res.status(200).json(matchingBooks);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

//  Get book review
public_users.get('/review/:isbn', function(req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[parseInt(isbn)].reviews);
});

module.exports.general = public_users;

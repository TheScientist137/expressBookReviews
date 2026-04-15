const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  let accessToken = jwt.sign({ username }, "access", { expiresIn: 3600 });

  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "User successfully logged in", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.accessToken;
  const decoded = jwt.verify(username, "access");

  books[isbn].reviews[decoded.username] = review;

  return res.status(200).json({
    message: `Review for ISBN ${isbn} has been added/updated`,
    reviews: books[isbn].reviews
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.accessToken;
  const decoded = jwt.verify(username, "access");

  if (books[isbn].reviews[decoded.username]) {
    delete books[isbn].reviews[decoded.username];
    return res.status(200).json({
      message: `Review by ${decoded.username} for ISBN ${isbn} has been deleted`,
      reviews: books[isbn].reviews
    });
  } else {
    return res.status(404).json({ message: "Review not found for this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

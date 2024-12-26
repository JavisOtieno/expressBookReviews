const express = require('express');
// let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// const express = require('express');

let books = require("./booksdb.js");
const general = express.Router();

// Define the URL for the books API (Replace this with your actual API endpoint)



// Route to get all books
public_users.get("/", (req, res) => {
  return res.status(200).json(books);
});

// Route to get book details by ISBN
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve ISBN from request parameters
  const book = books[isbn]; // Find the book with the given ISBN

  if (book) {
    res.status(200).json(book); // Return the book details as JSON
  } else {
    res.status(404).json({ message: "Book not found" }); // Return an error if book not found
  }
});


// Route to get books by author
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author; // Retrieve author from request parameters
  const booksByAuthor = Object.values(books).filter(book => book.author === author); // Filter books by author

  if (booksByAuthor.length > 0) {
    res.status(200).json(booksByAuthor); // Return the list of books by the author
  } else {
    res.status(404).json({ message: "No books found by this author" }); // Return an error if no books found
  }
});


// Route to get books by title
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title; // Retrieve title from request parameters
  const booksByTitle = Object.values(books).filter(book => book.title === title); // Filter books by title

  if (booksByTitle.length > 0) {
    res.status(200).json(booksByTitle); // Return the list of books with the given title
  } else {
    res.status(404).json({ message: "No books found with this title" }); // Return an error if no books found
  }
});




public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve ISBN from request parameters
    const book = books[isbn]; // Find the book with the given ISBN
  
    if (book && book.reviews) {
      res.status(200).json(book.reviews); // Return book reviews if found
    } else {
      res.status(404).json({ message: "No reviews found for this book" }); // Return error if no reviews found
    }
  });






// public_users.post("/register", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
//  });
  
// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// //  Get book review
// public_users.get('/review/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

module.exports.general = public_users;

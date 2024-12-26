const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const axios = require('axios');
// const auth_users = express.Router();

let users = [];

const SECRET_KEY = "RTYUIOFSDSFSD4567890"; // Replace with a more secure key for JWT generation
const BOOKS_API_URL = 'https://javisotieno-3000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/';
const BOOK_API_URL = 'https://javisotieno-3000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn';



// Check if the username is valid
const isValid = (username) => {
  return users.some(user => user.username === username); // Checks if username already exists in the users array
}

// Check if the username and password match
const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  return user && user.password === password; // Checks if user exists and password matches
}

// Register a new user (example)
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists." });
  }

  // Save the new user
  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully." });
});

// Login a user (creates and returns a JWT token)
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the user is authenticated
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Create a JWT token for the user
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  return res.status(200).json({ message: "Login successful", token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;          // Get ISBN from URL parameters
  const { username, review } = req.body; // Get username and review from the body of the request

  // Validate that username and review are provided
  if (!username) {
    return res.status(400).json({ message: "Username is required." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review is required." });
  }

  // Find the book by ISBN
  const book = books.find(book => book.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if a review by the same user already exists for this ISBN
  const existingReviewIndex = book.reviews ? book.reviews.findIndex(r => r.username === username) : -1;

  if (existingReviewIndex !== -1) {
    // Modify the existing review
    book.reviews[existingReviewIndex].review = review;
    return res.status(200).json({ message: "Review updated successfully." });
  } else {
    // Add a new review
    if (!book.reviews) {
      book.reviews = [];
    }
    book.reviews.push({ username, review });
    return res.status(201).json({ message: "Review added successfully." });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params; // Get ISBN from URL parameters
  const { username } = req.body; // Get the username from the body of the request

  // Validate if the username is provided
  if (!username) {
    return res.status(400).json({ message: "Username is required." });
  }

  // Find the book by ISBN
  const book = books.find(book => book.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Find the review index for the given ISBN and username
  const reviewIndex = book.reviews ? book.reviews.findIndex(r => r.username === username) : -1;

  if (reviewIndex === -1) {
    return res.status(404).json({ message: "Review not found or you are not authorized to delete this review." });
  }

  // Delete the review from the array
  book.reviews.splice(reviewIndex, 1);

  // Return a success message
  return res.status(200).json({ message: "Review deleted successfully." });
});


regd_users.get("/books", async (req, res) => {
  try {
    // Send a GET request to fetch the books from the API
    const response = await axios.get(BOOKS_API_URL);

    // Send the fetched data as the response
    res.status(200).json(response.data);
  } catch (error) {
    // Handle errors
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

// Route to get the book details based on ISBN using async/await and Axios
regd_users.get("/book/:isbn", async (req, res) => {
  const { isbn } = req.params; // Retrieve ISBN from request parameters

//   return res.status(200).json(`${BOOK_API_URL}/${isbn}`);
  try {
    // Send a GET request to fetch the book details based on ISBN from the API
    const response = await axios.get(`${BOOK_API_URL}/${isbn}`);

    // Check if the book exists
    if (response.data) {
      // Send the fetched book details as the response
      res.status(200).json(response.data);
    } else {
      // If no book is found with the given ISBN
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    // Handle errors
    console.error("Error fetching book details:", error);
    res.status(500).json({ message: "Failed to fetch book details" });
  }
});

regd_users.get("/author/:author", async (req, res) => {
    const { author } = req.params; // Retrieve author name from request parameters
  
    try {
      // Send a GET request to fetch the books by the author from the API
      const response = await axios.get(`${BOOKS_API_URL}/author/${author}`);
  
      // Check if books are found by the given author
      if (response.data && response.data.length > 0) {
        // Send the fetched book details as the response
        res.status(200).json(response.data);
      } else {
        // If no books are found by the given author
        res.status(404).json({ message: "No books found by this author" });
      }
    } catch (error) {
      // Handle errors
      console.error("Error fetching books by author:", error);
      res.status(500).json({ message: "Failed to fetch books by author" });
    }
  });

  // Route to get books by title using async/await and Axios
regd_users.get("/title/:title", async (req, res) => {
    const { title } = req.params; // Retrieve the title from request parameters
  
    // return res.status(200).json(`${BOOKS_API_URL}title/${title}`);
    try {
      // Send a GET request to fetch the books by the title from the API
      const response = await axios.get(`${BOOKS_API_URL}/title/${title}`);
  
      // Check if books are found by the given title
      if (response.data && response.data.length > 0) {
        // Send the fetched book details as the response
        res.status(200).json(response.data);
      } else {
        // If no books are found by the given title
        res.status(404).json({ message: "No books found with this title" });
      }
    } catch (error) {
      // Handle errors
      console.error("Error fetching books by title:", error);
      res.status(500).json({ message: "Failed to fetch books by title" });
    }
  });


// module.exports = auth_users;


// const isValid = (username)=>{ //returns boolean
// //write code to check is the username is valid
// }

// const authenticatedUser = (username,password)=>{ //returns boolean
// //write code to check if username and password match the one we have in records.
// }

// //only registered users can login
// regd_users.post("/login", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// // Add a book review
// regd_users.put("/auth/review/:isbn", (req, res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

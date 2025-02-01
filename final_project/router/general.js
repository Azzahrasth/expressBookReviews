const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// TASK 6 Register
public_users.post("/register", (req,res) => {
      const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// TASK 1 Get the book list available in the shop
public_users.get('/',function (req, res) {
   // Send JSON response with formatted books data
   res.send(JSON.stringify({ books: books }, null, 4)); 
});

// TASK 2 Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding books details
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// TASK 3 Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    
    // Create an array to store filtered books
    const result = [];

    // Get all ISBNs (keys) from the 'books' object
    const isbns = Object.keys(books);

    // Iterate through each ISBN and check if the author matches
    isbns.forEach(isbn => {
        if (books[isbn].author === author) {
            // Create a new object with only isbn, title, and reviews
            result.push({
                isbn: isbn,
                title: books[isbn].title,
                reviews: books[isbn].reviews
            });
        }
    });

    // Send the result with proper indentation
    res.send(JSON.stringify({ booksbyauthor: result }, null, 4));
});


// TASK 4 Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    
    // Create an array to store filtered books
    const result = [];

    // Get all ISBNs (keys) from the 'books' object
    const isbns = Object.keys(books);

    // Iterate through each ISBN and check if the title matches
    isbns.forEach(isbn => {
        if (books[isbn].title === title) {
            // Create a new object with only isbn, title, and reviews
            result.push({
                isbn: isbn,
                author: books[isbn].author,
                reviews: books[isbn].reviews
            });
        }
    });

    // Send the result with proper indentation
    res.send(JSON.stringify({ booksbytitle: result }, null, 4));
});

// TASK 5 Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Retrieve the isbn parameter from the request URL and send the corresponding books details
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// TASK 10 Get the book list

// Version: Using Async/Await
const getAllBooks = async () => {
    try {
        return await axios.get('http://localhost:5000/');
    } catch (error) {
        throw new Error("Failed to fetch books from server");
    }
};

public_users.get('/async', async (req, res) => {
    try {
        const response = await getAllBooks();
        res.send(response.data);
    } catch (error) {
        res.status(500).send("Error fetching book list");
    }
});

// TASK 11 Get book details based on ISBN

// Version: Using promise
public_users.get('/promise/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    const book_by_isbn = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("ISBN not found");
        }
    });

    book_by_isbn
        .then(book => res.send(book))
        .catch(error => res.status(404).send(error));
});

// TASK 12 Get book details based on Author
// Version: Using Promises
public_users.get('/promise/author/:author', (req, res) => {
    const author = req.params.author;

    const book_by_author = new Promise((resolve, reject) => {
    
    // Create an array to store filtered books
    const result = [];

    // Get all ISBNs (keys) from the 'books' object
    const isbns = Object.keys(books);

    // Iterate through each ISBN and check if the author matches
    isbns.forEach(isbn => {
        if (books[isbn].author === author) {
            // Create a new object with only isbn, title, and reviews
            result.push({
                isbn: isbn,
                title: books[isbn].title,
                reviews: books[isbn].reviews
            });
        }
    });

    if(result.length > 0){
        // Send the result with proper indentation
        resolve(res.send(JSON.stringify({ booksbyauthor: result }, null, 4)));
    }else{
        reject("Author not found");
    }
    });

    book_by_author
        .then(book => res.send(book))
        .catch(error => res.status(404).send(error));
});

// TASK 13 Get book details based on Title
// Version: Using Promises
public_users.get('/promise/title/:title', (req, res) => {
    const title = req.params.title;

    const book_by_title = new Promise((resolve, reject) => {
    
    // Create an array to store filtered books
    const result = [];

    // Get all ISBNs (keys) from the 'books' object
    const isbns = Object.keys(books);

    // Iterate through each ISBN and check if the title matches
    isbns.forEach(isbn => {
        if (books[isbn].title === title) {
            // Create a new object with only isbn, title, and reviews
            result.push({
                isbn: isbn,
                author: books[isbn].author,
                reviews: books[isbn].reviews
            });
        }
    });

    if(result.length > 0){
        // Send the result with proper indentation
        resolve(res.send(JSON.stringify({ booksbytitle: result }, null, 4)));
    }else{
        reject("title not found");
    }
    });

    book_by_title
        .then(book => res.send(book))
        .catch(error => res.status(404).send(error));
});


module.exports.general = public_users;

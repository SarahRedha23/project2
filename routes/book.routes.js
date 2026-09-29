const router = require("express").Router()
const Book = require('../models/Book.js')
const isSignedIn = require('../middleware/is-signed-in')
const Review = require('../models/Review.js')
const upload = require('../middleware/upload')


router.get('/new',isSignedIn, async(req,res)=>{
    res.render('books/new.ejs')
})

router.post('/', isSignedIn, upload.single('image'), async (req, res) => {

const book = await Book.create({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        description: req.body.description,
        image: req.file ? req.file.path : "",
        createdBy: req.session.user._id
    })
    req.session.toast = "Book added successfully!"

    res.redirect('/books')
})

router.get('/',isSignedIn, async (req,res)=>{
    const books = await Book.find()
    res.render('books/index.ejs',{books: books})
})

router.get("/:bookId", async (req,res)=>{

    const showBook = await Book.findById(req.params.bookId)
        .populate('createdBy')
        const reviews = await Review.find({
            book: req.params.bookId
        }).populate('user')

    res.render('books/show.ejs', {
       book: showBook,
       reviews : reviews,
       user: req.session.user
    })
})

router.delete("/:bookId" ,isSignedIn, async(req,res)=>{
    const showBook = await Book.findById(req.params.bookId)
    if(!showBook.createdBy.equals(req.session.user._id)){
        return res.send("You are not the creater")
    }
    const deleteBook = await Book.findByIdAndDelete(req.params.bookId)
    req.session.toast = "Book deleted successfully!"
    res.redirect('/books')
})

router.get("/:bookId/edit",isSignedIn, async(req,res)=>{
    const foundBook = await Book.findById(req.params.bookId)
    res.render("books/edit.ejs", {book: foundBook})
})

router.put("/:bookId" ,isSignedIn, async(req,res)=>{
    const book = await Book.findById(req.params.bookId)

    if(!book.createdBy.equals(req.session.user._id)){
        return res.send("You are not the creator")
    }

    const {title, author, genre,description}= req.body
    const updateBook = await Book.findByIdAndUpdate(req.params.bookId, {
        title,
        author,
        genre,
        description
    })
    req.session.toast = "Book updated successfully!"
    res.redirect("/books")
})



module.exports = router;


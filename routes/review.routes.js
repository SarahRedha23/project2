const router = require("express").Router()
const Review = require('../models/Review.js')
const Book = require('../models/Book.js')
const isSignedIn = require('../middleware/is-signed-in.js')

// Create review
router.post('/:bookId', isSignedIn, async(req,res)=>{

    await Review.create({
        rating: req.body.rating,
        comment: req.body.comment,
        dateRead: req.body.dateRead,
        user: req.session.user._id,
        book: req.params.bookId
    })

    req.session.toast = "Review added successfully!"
    res.redirect('/books')
})

// Delete review
router.delete('/:reviewId', isSignedIn, async (req,res)=>{

    const review = await Review.findById(req.params.reviewId)

    if(!review.user.equals(req.session.user._id)){
        return res.send("You are not the creator")
    }

    await Review.findByIdAndDelete(req.params.reviewId)

    req.session.toast = "Review deleted successfully!"
    res.redirect(`/books/${review.book}`)
})

// Show edit review page
router.get('/:reviewId/edit', isSignedIn, async (req, res) => {

    const review = await Review.findById(req.params.reviewId)

    if (!review.user.equals(req.session.user._id)) {
        return res.send("You are not the creator")
    }

    res.render('reviews/edit.ejs', { review })
})

// Update review
router.put('/:reviewId', isSignedIn, async (req, res) => {

    const review = await Review.findById(req.params.reviewId)

    if (!review.user.equals(req.session.user._id)) {
        return res.send("You are not the creator")
    }

    review.rating = req.body.rating
    review.comment = req.body.comment
    review.dateRead = req.body.dateRead

    await review.save()

    req.session.toast = "Review updated successfully!"
    res.redirect(`/books/${review.book}`)
})

// My Reviews
router.get("/my-reviews", isSignedIn, async (req, res) => {

    try {

        const reviews = await Review.find({
            user: req.session.user._id
        }).populate("book")

        // Remove reviews where the book no longer exists
        const validReviews = reviews.filter(review => review.book)

        res.render("reviews/my-reviews.ejs", {
            reviews: validReviews
        })

    } catch (error) {

        console.log(error)
        res.send("Something went wrong")

    }

})

module.exports = router

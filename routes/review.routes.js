const router = require("express").Router()
const Review = require('../models/Review.js')
const Book = require('../models/Book.js')
const isSignedIn = require('../middleware/is-signed-in.js')

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

router.delete('/:reviewId', isSignedIn, async (req,res)=>{
    const review = await Review.findById(req.params.reviewId)
    if(!review.user.equals(req.session.user._id)){
        return res.send("You are not the creator")

    }
    await Review.findByIdAndDelete(req.params.reviewId)
    req.session.toast = "Review deleted successfully!"
    res.redirect(`/books/${review.book}`)
})

router.get('/:reviewId/edit', isSignedIn, async (req, res) => {

    const review = await Review.findById(req.params.reviewId)

    if (!review.user.equals(req.session.user._id)) {
        return res.send("You are not the creator")
    }

    res.render('reviews/edit.ejs', { review })
})

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

module.exports = router;
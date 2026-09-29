const router = require("express").Router()
const Book = require("../models/Book.js")


router.get("/", async (req, res) => {
    try {

        const books = await Book.find()
            .sort({ createdAt: -1 })
            .limit(3)

        res.render("homepage.ejs", { books })

    } catch (error) {

        console.log(error)
        res.send("Something went wrong")

    }
})
module.exports = router;

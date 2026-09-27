const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating:{
        type: Number,
        required: true,
    min: 1,
    max: 5
    },
    comment:{
        type: String,
        required: true
    },
    dateRead:{
        type:  Date,
        required: true
    },
    user:{
         type:mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
    },
    book:{
         type:mongoose.Schema.Types.ObjectId,
                ref: 'Book',
                required: true
    }
},{timestamps: true})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
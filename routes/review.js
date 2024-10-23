const express = require("express");
const router = express.Router({mergeParams :true});

const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../shema.js");

const Review  = require("../models/review.js");
const Listing = require("../models/listing.js");

const listingReview = require("../controller/review.js");

const { isLoggedIn ,
  isReviewAuthor} = require("../middlewear.js");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    
    if (error) {
      // Ensure error.details exists before calling map on it
      const errMsg = error.details ? error.details.map((el) => el.message).join(",") : "Validation error";
      throw new ExpressError(400,errMsg);
    } else {
      next();
    }
};



router.post("/" ,  isLoggedIn, validateReview, wrapAsync(listingReview.createReview));
   
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(listingReview.deleteReview));
   
  
module.exports = router;
    
   
   
const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {checkAuthentication,validateReview , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Reviews root
// post root.....

router.post("/",checkAuthentication, validateReview , wrapAsync(reviewController.createReview )
);
 
// delete root....

router.delete("/:reviewId",checkAuthentication,isReviewAuthor, wrapAsync(reviewController.deleteReview)
);

module.exports = router;

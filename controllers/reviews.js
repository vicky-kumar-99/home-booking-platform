const Listing = require("../model/listing.js");
const Review = require("../model/reviews.js");

module.exports.createReview = async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();

    console.log("new reviews recieve");
    req.flash("success", "New Review Add");
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.deleteReview = async (req,res) => {
      let {id, reviewId} = req.params;
      await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});
      await Review.findByIdAndDelete(reviewId);
      req.flash("success", "Review Deleted");
      res.redirect(`/listings/${id}`);
    
}
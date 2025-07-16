const Listing = require("./model/listing")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./model/reviews.js");
// module.exports.isloggedIn = (req, res, next) => {
    
//     if(!req.isAuthenticated()) {
//         req.flash("error", "you must be login in to creating listing");
//         res.redirect("/login");
//     }
//     next();
// }

module.exports.checkAuthentication = (req,res,next) => {
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else{
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be login in to creating listing");
        res.redirect("/login");
    }
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();

}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next()
}

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    
    if(error) {
        let errMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMessage);
    } else {
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    
    if(error) {
        let errMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMessage);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next()
}

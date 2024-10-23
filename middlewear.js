const Listing = require("./models/listing");
const Review = require("./models/review");

const isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "yo umust log in to do changes");
        return res.redirect("/login")

    }

    next();
}

// module.exports = isLoggedIn;

// const saveRedirecrUrl = (req,res,next)=>{
//     if(req.session.redirectUrl){
//         res.locals.redirectUrl = req.session.redirectUrl;
//     }
//     next()
// }

// module.exports = saveRedirecrUrl;   

const isOwner =  async (req,res,next)=>{
    let  {id}= req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner")
        return(res.redirect(`/listings/${id}`));
    }

    next();
} 

const isReviewAuthor =  async (req,res,next)=>{
    let  {reviewId,id}= req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the author")
        return(res.redirect(`/listings/${id}`));
    }

    next();
} 

module.exports = {
    isLoggedIn,
    isOwner,
    isReviewAuthor,
};

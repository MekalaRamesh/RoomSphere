const express = require("express");
const router = express.Router();
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage})


const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../shema.js");
const Listing = require("../models/listing.js");

const  {isLoggedIn,isOwner} = require("../middlewear.js");

const listingController = require("../controller/listing.js")

const validateListing = (req,res,next) =>{
    let error = listingSchema.validate(req.body);
    if(error){
      throw new ExpressError(400,error);
    }
    else{
      next();
    }
};


 
router
  .route("/")
  .get( isLoggedIn, wrapAsync(listingController.index))
  .post( isLoggedIn, upload.single("Listing[image]"), wrapAsync(listingController.createListing) );

router.get("/new",isLoggedIn, (listingController.renderNewForm));
   
router.route("/:id")
  .get(isLoggedIn, wrapAsync( listingController.showListing) )
  .put( isLoggedIn,isOwner,upload.single("Listing[image]"),   wrapAsync(listingController.updateListing))
  .delete( isLoggedIn, isOwner,  wrapAsync(listingController.deleteListing)); 


    
router.get("/:id/edit",  isLoggedIn, isOwner,  wrapAsync(listingController.renderEditForm));
  
module.exports = router;

const Listing = require("../models/listing");
const validateListing = require("../routes/listing")

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const index = async (req,res) =>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
}

const renderNewForm = (req, res) =>{
  
    res.render("listings/new.ejs");
   
}

const showListing = async(req, res,next) =>{
    
    let {id} = req.params;
    const Listings = await Listing.findById(id)
    .populate({
      path :"reviews",
    populate :{
      path :"author",
    },
    })
  .populate("owner");
    if(!Listings){
      req.flash("error", "listing you requested does not exist");
      res.redirect("/listings")
    }
    res.render("listings/show.ejs", {Listings});
   
}

const createListing = async (req, res,next) =>{
   
    

   let response =  await geocodingClient.forwardGeocode({
      query: req.body.Listing.location,
      limit: 1,
    })
      .send();

      console.log(response.body.features[0].geometry);
    
      
    
    let url = req.file.path;
    let filename = req.file.filename;

      const listing1 =  new Listing(req.body.Listing) ;
      listing1.owner = req.user._id;
      listing1.image = {url,filename};
      listing1.geometry = response.body.features[0].geometry;
      let saved = await listing1.save();
      console.log(saved);
      req.flash("sucess" , "listing added sucessfully");
      console.log(listing1);
      res.redirect("/listings");
    
}

const renderEditForm = async(req, res,next) =>{
    
    let {id} = req.params;
    const Listings = await Listing.findById(id);

    if(!Listings){
      req.flash("error", "listing you requested does not exist");
      res.redirect("/listings")
    }

    let originalUrl = Listings.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/h_300,w_250");
   
    res.render("listings/edit.ejs",{Listings,originalUrl});
   
}


const updateListing = async(req, res,next) =>{
    
    validateListing;
    // if( !req.body.Listing){
    //   throw new ExpressError(404,"send valid data");
    // }
    let {id} = req.params;  
    const Listings = await Listing.findByIdAndUpdate(id,{ ...req.body.Listing});

    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      Listings.image = {url,filename};
      await Listings.save();
    }
   
    req.flash("sucess" , "listing edited sucessfully");
    res.redirect(`/listings/${id}`);
  
}

 const deleteListing = async(req, res ,next) =>{
    
    let {id} = req.params;
   const delListings = await Listing.findByIdAndDelete(id);
  
   req.flash("sucess" , "listing deleted sucessfully");
   res.redirect("/listings");
  
}

module.exports = {
   index,
   renderNewForm,
   showListing,
   createListing,
   renderEditForm,
   updateListing,
   deleteListing,
};


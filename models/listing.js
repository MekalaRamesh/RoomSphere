const mongoose = require("mongoose");
//const { schema } = require("../../mongo2/models/chat");
const Review = require("./review.js");
const { required, number } = require("joi");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type : String,
        required  :true
    },
    description :String,
    image :{
       filename :  String,
       url : String,
    },
    price : Number,
    location :String,
    country  : String,
    reviews :[{
      type : Schema.Types.ObjectId,
      ref : "review"

    }],
    owner :{
      type : Schema.Types.ObjectId,
      ref : "User"
    },
    geometry :{
      type :{
        type : String,
        enum : ['Point'],
        required :true

      },
      coordinates :{
        type : [Number],
        required :true
      }
    }
});

listingSchema.post("findOneAndDelete" ,async(listing) =>{
  if(listing){
      await Review.deleteMany({_id: {$in: listing.reviews}});
  }
})

const Listing = mongoose.model("Listing" ,listingSchema);
module.exports = Listing;
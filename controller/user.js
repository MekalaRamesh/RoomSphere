const User = require("../models/user");

const renderSignupForm = (req, res) =>{
    res.render("users/signup.ejs");
}

const signup = async(req, res) =>{
    try{
        let {username,email,password } =req.body;
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password); 
        console.log(registeredUser);
        req.login(registeredUser, (err) =>{
            if(err){
                next(err)
            }
    
            req.flash("sucess","signed up sucessfully");
            res.redirect("/listings");
    
        });
        
    
    }
    catch(e){
    
        req.flash("error" ,e.message);
        res.redirect("/signup");
    
    }
    
}

const renderLoginForm = (req, res) =>{
    res.render("users/login.ejs");
}

const login =  async(req, res) =>{

    req.flash("sucess" ,"you loged in sucessfulley");
    res.redirect("/listings");
}


const logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err)
        }

        req.flash("sucess" , "loged out sucessfully");
        res.redirect("/login");
        
    })
}

module.exports = {
   renderSignupForm,
   signup,
   renderLoginForm,
   login,
   logout,

 };
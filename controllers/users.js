const User = require("../model/user.js"); 

module.exports.renderSignUpFrom = (req,res) => {
    res.render("users/signUp.ejs");
}

module.exports.signUp = async (req, res) => {
    try {
        let {username, email, password} = req.body;
    let newUser = new User({email, username});
   let registerUser = await User.register(newUser, password);
   console.log(registerUser);
   req.login(registerUser, (err) => {
        if(err) {
            next(err);
        }
        req.flash("success", "welcom to my page");
        res.redirect("/listings");
   })
   
    }
    catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
      req.flash("success", "welcom back to wanderlust");
      let redirect = res.locals.redirectUrl || "/listings";
      res.redirect(redirect);
}

module.exports.logOut = (req,res,next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
}
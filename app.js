var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    path  = require("path"),
    mongoose = require("mongoose");

var User = require("./models/userSchema"),
    Blog = require("./models/blogSchema");
    
var indexRoutes = require('./routes/index'),
    authRoutes = require("./routes/authRoutes"),
    blogRoutes = require("./routes/blogRoutes");

mongoose.connect("mongodb://localhost:27017/jobpost", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + '/public')));

//Passport Configuration
app.use(require("express-session")({
    secret: "This is my secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    console.log(req.user);
   res.locals.currentUser = req.user;
   next();
});

app.use(indexRoutes);
app.use(authRoutes);
app.use(blogRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is connected!!");
});

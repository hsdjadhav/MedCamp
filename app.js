require('dotenv').config();
var	flash			= require("connect-flash"),
	express 		= require("express"),
    app 			= express(),
    bodyParser 		= require("body-parser"),
    mongoose 		= require("mongoose"),	
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	methodOverride	= require("method-override"),
	Campground		= require("./models/campground"),
	Comment			= require("./models/comment"),
	User			= require("./models/user"),
	seedDB			= require("./seeds"),
	commentRoutes		= require("./routes/comments"),
	campgroundsRoutes	= require("./routes/campgrounds"),
	indexRoutes			= require("./routes/index");

// seedDB();

app.use(flash());

// PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

// mongoose.connect("mongodb://localhost/yelp_camp_v12",{useNewUrlParser: true, useUnifiedTopology: true});
const DATABASE_NAME = process.env.DATABASE_NAME || 'yelp_camp_v12';

mongoose.connect(process.env.DATABASE_URL, {
    dbName: DATABASE_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

// mongoose.connect("mongodb://medcamp-frt:KUcMx4eYNpVk8cr5FBe24C9ab7Xa6kCywCcna5WyOu91pXGs7SyWr9ycnF8lozldFW2zYz2MxoipPQrSH7avcg==@medcamp-frt.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@medcamp-frt@", function (err, db) {
//	db.close();
 // });



app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// requiring routes

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundsRoutes);

app.listen(8080, function(){
	console.log("YelpCamp Has Started!")
});
var express		= require("express");
var router		= express.Router();
var Campground	= require("../models/campground");
var middleware	= require("../middleware");
// INDEX -- Show all campgrounds
router.get("/campgrounds", function(req, res){

	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
		}
	});
});

// CREATE -- Add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price: price, image: image, description: desc, author:author}
// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			// Redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});	
});

// New - show form to create new campgrounds
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){

			   res.render("campgrounds/new");
});
// SHOW -- Shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash('error', 'Campground not found');
			res.redirect("back");
		} else {
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});	
});

// EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){	
		Campground.findById(req.params.id, function(err, foundCampground){			
				res.render("campgrounds/edit", {campground: foundCampground});					});
	});

// UDPATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update the current campground
	
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, {useFindAndModify: false}, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	//redirect somewhere(show page)
});

//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, {useFindAndModify: false}, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;
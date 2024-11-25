const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Directory to save uploads
const { ObjectId } = require("mongodb");
var { User, Child } = require("../app/models/user");

module.exports = function (app, passport, db) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================

  app.get("/profile", isLoggedIn, function (req, res) {
    console.log(req.user)
    res.render("profile.ejs", {
      user: req.user,
    });
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout(() => {
      console.log("User has logged out!");
    });
    res.redirect("/");
  });

  // message board routes ===============================================================

  app.get("/", (req, res) => {
    // default page happen on refresh
    db.collection("users")
      .find()
      .toArray((err, result) => {
        //go to db and finds all of the
        if (err) return console.log(err); //reading the html
        res.render("index.ejs", { users: result });
      });
  });


  //help
  app.get("/families", isLoggedIn, (req, res) => {
    // renders family portal
    console.log(req.user)

    db.collection("users")
      .find({ 'local.userType': "providers" })
      .toArray((err, result) => {
        //go to db and finds all of the
        if (err) return console.log(err); //reading the html
        res.render("providers.ejs", { users: result });
      });
  });
  
app.get("/providers", isLoggedIn, (req, res) => {
    // renders provider portal

    db.collection("users")
      .find({ 'local.userType': "families" })
      .toArray((err, result) => {
        //go to db and finds all of the
        if (err) return console.log(err); //reading the html
        res.render("families.ejs", { users: result });
      });
  });

  app.get("/singleListing/:id", isLoggedIn, (req, res) => {
    db.collection("users")
    .findOne({ '_id': ObjectId(req.params.id)},(err, result) => {
      //go to db and finds all of the
      if (err) return console.log(err); //reading the html
      console.log(result)
      res.render("singleListing.ejs", { user: result });
    });
   
  });


  
  //photo upload

  app.post("/uploadPhoto", upload.single("photo"), (req, res) => {
    console.log("File received:", req.file);
    console.log(req.body);

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded!" });
    }

    const id = req.body.id; // The ID of the document you want to update
    const photoPath = `/uploads/${req.file.filename}`; // Path of uploaded file
    console.log(id);

    //???
    db.collection("users").updateOne(
      { _id: ObjectId(id) },
      { $set: { photo: photoPath } },
      (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err });
        // res.redirect(req.user.local.local.userType === "families" ? '/providers' : '/families')
        res.redirect("/profile");
      }
    );
  });

  app.delete("/messages", (req, res) => {
    const itemId = req.body._id;

    db.collection("Crud1").findOneAndDelete(
      { _id: new ObjectId(itemId) },
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Item deleted!");
      }
    );
  });

  // app.post('/messages', (req, res) => {
  //   db.collection('messages').save({name: req.body.name, msg: req.body.msg, thumbUp: 0}, (err, result) => {
  //     if (err) return console.log(err)
  //     console.log('saved to database')
  //     res.redirect('/profile')
  //   })
  // })

  // app.put('/messages', (req, res) => {
  //   db.collection('messages')
  //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
  //     $set: {
  //       thumbUp:req.body.thumbUp + 1
  //     }
  //   }, {
  //     sort: {_id: -1},
  //     upsert: true
  //   }, (err, result) => {
  //     if (err) return res.send(err)
  //     res.send(result)
  //   })
  // })

  // app.put('/messages2', (req, res) => {
  //   db.collection('messages')
  //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
  //     $set: {
  //       thumbUp:req.body.thumbUp - 1
  //     }
  //   }, {
  //     sort: {_id: -1},
  //     upsert: true
  //   }, (err, result) => {
  //     if (err) return res.send(err)
  //     res.send(result)
  //   })
  // })

  // app.delete('/messages', (req, res) => {
  //   db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
  //     if (err) return res.send(500, err)
  //     res.send('Message deleted!')
  //   })
  // })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post("/login",
    passport.authenticate("local-login", {
      // successRedirect : '/families',
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    }),
    function (req, res) {
      res.redirect(req.user.local.userType === "families" ? "/providers" : "/families");
    }
  );
  
  app.post('/profile', (req, res) => {
    // db.collection('users').save({name:req.user.name,dob:req.user.dob,gender:req.user.gender, familySize: req.user.familySize}, (err, result) => {
    //   if (err) return console.log(err)
    //   console.log('saved to database')
    //   res.redirect('/profile')
    // })
  })
// create a new child 

  app.post('/addChild', (req, res) => {
    var newChild    = new Child();
    newChild.name= req.body.childName
    newChild.dob = req.body.childDob
    newChild.gender = req.body.childGender
    newChild.allergies = req.body.childAllergies
    newChild.medications = req.body.childMedications
    req.user.local.children.push(newChild)
    req.user.save()
    console.log('add child', req.body)
      res.redirect('/profile')
    })

    // app.post('/addParent', (req, res) => {
    //   var newParent    = new Child();
    //   newParent.name= req.body.ParentName
    //   newParent.dob = req.body.ParentDob
    //   newParent.gender = req.body.ParentGender
    //   newParent.allergies = req.body.ParentAllergies
    //   newParent.medications = req.body.ParentMedications
    //   req.user.local.children.push(newParent)
    //   req.user.save()
    //   console.log('add parent', req.body)
    //     res.redirect('/profile')
    //   })


  app.put('/profile', (req, res) => {
    const { _id, ...updatedFields } = req.body;
  
    db.collection('users')
      .findOneAndUpdate(
        { _id: new ObjectId(_id) }, // Query to find the specific document by its ID
        { $set: updatedFields }, // Dynamically set fields based on client input
        { returnDocument: 'after' },
        (err, result) => {
          if (err) return res.send(err);
          res.send(result);
        }
      );
  });




  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/families" || "/providers", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}


const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Directory to save uploads
const { ObjectId } = require('mongodb');

module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('users').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            users: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });


// message board routes ===============================================================


app.get('/', (req, res) => {// default page happen on refresh
  db.collection('users').find().toArray((err, result) => {//go to db and finds all of the
    if (err) return console.log(err)//reading the html 
    res.render('index.ejs', {users: result})
  })
})

app.get('/families',isLoggedIn,(req, res) => {// renders family portal
  // console.log(req.user)

  db.collection('users').find({type:'providers'}).toArray((err, result) => {//go to db and finds all of the
    if (err) return console.log(err)//reading the html 
    res.render('providers.ejs', {users: result})
  })
})


app.get('/providers',isLoggedIn, (req, res) => {// renders family portal

  db.collection('users').find({type:'families'}).toArray((err, result) => {//go to db and finds all of the
    if (err) return console.log(err)//reading the html 
    res.render('families.ejs', {users: result})
  })
})


//photo upload


app.post('/uploadPhoto', upload.single('photo'), (req, res) => {
  console.log('File received:', req.file);
  console.log(req.body);

  if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded!' });
  }

  const id = req.body.id; // The ID of the document you want to update
  const photoPath = `/uploads/${req.file.filename}`; // Path of uploaded file
console.log(id)

db.collection('users').updateOne(
  { _id: ObjectId(id) },
  { $set: { photo: photoPath } },
  (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err });
      // res.redirect(req.user.type === "families" ? '/providers' : '/families')
       res.redirect('/profile')

  }
);
});


app.delete('/messages', (req, res) => {
  const itemId = req.body._id;

  db.collection('Crud1').findOneAndDelete({ _id: new ObjectId(itemId) }, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Item deleted!');
  });
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
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            // successRedirect : '/families', 
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
      function(req,res){
        res.redirect(req.user.type === "families" ? '/providers' : '/families')
      });

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/families', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

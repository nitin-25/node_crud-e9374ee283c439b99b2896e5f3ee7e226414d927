const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const users = require("../models/users");


//image upload
var storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,"./uploads")
    },
    filename : function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },

});

var upload = multer({
    storage : storage
}).single("image");

//insert a user into Db routes
router.post("/add", upload, async (req, res) => {
    const user  = new User({
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        image : req.file.filename,
    });
    try {
        await user.save();
        req.session.message = {
            type: "success",
            message: "User added successfully!"
        };
        res.redirect("/");
    } catch (err) {
        res.json({message: err.message, type: "danger"});
    }
});

//get all users
router.get("/",(req,res) => {
    User.find().exec()
    .then(users => {
        res.render('index', {
            title: 'Home Page',
            users : users,
        })
        //console.log('Users found:', users);
      })
      .catch(err => {
        console.error('Error finding users:', err);
      });
    
});



router.get("/add", (req, res) => {
    res.render("add-users" , { title : "addUser;"});
})

module.exports = router;
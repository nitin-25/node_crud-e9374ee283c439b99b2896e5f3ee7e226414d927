const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const users = require("../models/users");
const fs = require("fs");
const { type } = require("os");


//image upload with multer
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

router.get("/edit/:id", (req,res) => {
    let id = req.params.id;
    User.findById(id)
    .then(user => {
        if (!user) {
            res.redirect("/");
        } else {
            res.render("update-user", {
                title: "Edit - User",
                user: user,
            });
        }
    })
    .catch(err => {
        res.redirect("/");
    });
});


router.get("/add", (req, res) => {
    res.render("add-users" , { title : "addUser;"});
})

router.post("/update/:id/", upload, async (req, res) => {
    let id = req.params.id;
    let new_image = "";
    //console.log(req.body.old_image)

    if(req.file){
        new_image = req.file.filename;
        try{    
            fs.unlinkSync("./uploads/"+req.body.old_image);

        }catch(err){
            console.log(err);
        }
    }
    else{
         new_image = req.body.old_image; 
    }
    const result = await User.findByIdAndUpdate(id, {
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        image : new_image,
    });
    if(!result) {
        res.redirect('/');
    }
    else {
        req.session.message = {
            type: 'success',
            message: 'User updated successfully',
        };
        res.redirect('/');
    }

});

//delete user route
router.get("/delete/:id", async (req, res) => {
    let id = req.params.id;
    const result = await User.findByIdAndDelete(id);
    if(result.image != ""){
        try{    
            fs.unlinkSync("./uploads/"+result.image);

        }catch(err){
            console.log(err);
        }
    }
    if(!result) {
        res.redirect('/');
    }
    else {
        req.session.message = {
            type: 'success',
            message: 'User deleted successfully!',
        };
        res.redirect('/');
    }

});

module.exports = router;


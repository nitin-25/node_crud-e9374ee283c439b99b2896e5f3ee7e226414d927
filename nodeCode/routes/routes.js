const express = require("express");
const router = express.Router();

router.get("/",(req,res) => {
    //res.send('all users');
    res.render("index", { title : "Home page"});
});

router.get("/add", (req, res) => {
    res.render("add-users" , { title : "addUser;"});
})

module.exports = router;
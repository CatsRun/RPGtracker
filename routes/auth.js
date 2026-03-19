const express = require("express");
const passport = require("passport");

const router = express.Router();

// Google Oauth login
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google redirects back here after login
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/auth/failure",
        successRedirect: "/auth/sucess",
    })
);

// Success route
router .get("/sucess", (req, res) => {
    res.json({
        message: "Logged in sucessfully",
        user: req.user,
    });
});

// Failure route
router.get("/failure", (req, res) => {
    res.status(401).json({ error: "Failed to authenticate" });
});

// Logout
router.get("/logout", (req, res) => {
    req.logout(() => {
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.json({ message: "Logged out" });
        })
    });
});

module.exports = router;
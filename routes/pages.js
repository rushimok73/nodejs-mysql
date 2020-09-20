const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/', authenticateJWT, (req, res) => {
  res.render("index", {
    user: req.user,
  });
})


router.get('/register', notauthenticateJWT, (req, res) => {
  res.render("register");
})


router.get('/login', notauthenticateJWT, (req, res) => {
  res.render("login");
})

router.get('/logout', function(req,res){
 res.clearCookie('jwt');
 res.redirect('/login');
});

async function notauthenticateJWT(req, res, next) {
  const token = req.cookies.jwt || '';
  try {
    if (!token) {
      next()
    } else {
      return res.redirect('/');
    }
  } catch (e) {
    return res.status(500).json(err.toString());
    next()
  }
}

async function authenticateJWT(req, res, next) {
  console.log(req.cookies.jwt);
  const token = req.cookies.jwt || '';
  try {
    if (!token) {
      return res.status(401).redirect('/login');
    }
    const decrypt = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decrypt.id,
      email: decrypt.email,
      phoneno: decrypt.phoneno,
    };
    console.log(req.user);
    next()
  } catch (err) {
    return res.status(500).json(err.toString());
    next()
  }

};

module.exports = router;

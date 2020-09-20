const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({
  path :'./.env'
})

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
})

exports.register = (req, res) => {
  console.log(req.body);

  const email = req.body.UserEmail;
  const password = req.body.UserPassword;
  const passwordconfirm = req.body.ConfirmUserPassword;
  const phoneno = req.body.UserPhoneNumber;
  let hashedpassword;

  db.query('SELECT UserEmail FROM login WHERE UserEmail = ?', [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return res.render('register', {
          message: 'That email is already in use'
        });
      }else if(password !== passwordconfirm) {
        console.log("NO MATCH");
        return res.render('register', {
          message: 'Passwords donot match'
        });
      }
      console.log("????");
      try{
        hashedpassword = await bcrypt.hash(password, 8);
        console.log(hashedpassword);
      }catch(e){
        console.log(error);
      }

      db.query('INSERT INTO login SET ?', {UserEmail: email, UserPhoneNumber: phoneno, UserPassword: hashedpassword},
        (error, results) => {
          if(error){
            console.log(error);
          }else{

            db.query('SELECT * FROM login WHERE UserEmail = ?', [email],
            async (error, results)=>{
              if(results.length>0){
                console.log("-----------");
                const resultid = results[0].UserID;
                console.log(resultid);
                db.query('INSERT INTO user SET ?', {UserID: resultid, UserPhoneNumber: phoneno},
                  (error, results) => {
                    if(error){
                      console.log(error);
                    }else{
                      //
                    }
                })
              }else{
                console.log("Email doesnt exist");
                return res.json({message: "Doesn't Exist"});
              }
            })
            return res.render('login', {
              message: 'User Registered'
            })
          }

      })

    })
}

exports.login = async (req,res) => {
  try{
    const email = req.body.UserEmail;
    const password = req.body.UserPassword;

    if(!email || !password){
      return res.status(400).render('login' , {
        message: 'Please provide email and password'
      })
    }

    db.query('SELECT * FROM login WHERE UserEmail = ?', [email],
    async (error, results) => {
      console.log(results);
      if(!results || !(await bcrypt.compare(password, results[0].UserPassword)) ){
        res.status(401).render('login', {
          message:'Invalid Credentials'
        })
      }else{
        const id = results[0].id;
          const token = jwt.sign({id: id, email:results[0].UserEmail, phoneno:results[0].UserPhoneNumber}, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        })

        console.log("Token created on login");

        const coookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        }
        res.cookie('jwt', token, coookieOptions);
        res.status(200).redirect('/');
      }
    })
  }catch(e){
    console.log(e);
  }
}

exports.checkfieldsemail = async(req,res) => {
  const email = req.body.UserEmail;

  db.query('SELECT * FROM login WHERE UserEmail = ?', [email],
  async (error, results)=>{
    if(results.length>0){
      console.log("Email already exists!");
      return res.json({message: "Exists"});
    }else{
      console.log("Email doesnt exist");
      return res.json({message: "Doesn't Exist"});
    }
  })
}

exports.checkfieldsphoneno = async(req,res) => {
  const phoneno = req.body.UserPhoneNumber;

  db.query('SELECT * FROM login WHERE UserPhoneNumber = ?', [phoneno],
  async (error, results)=>{
    if(results.length>0){
      console.log("Phone number already exists!");
      return res.json({message: "Exists"});
    }else{
      console.log("Phone Number doesnt exist");
      return res.json({message: "Doesn't Exist"});
    }
  })
}

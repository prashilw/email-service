const express = require('express');
const app = express();
const basicAuth = require('basic-auth');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || "8000";
const sendEmail = require('./email');

app.use(express.json());

const secretKey = 'Dd4IbLO1yqAUdnxpaZLNQj6Vsnwp2hD97jlKrzgt-xg';

const users = [
    {
        id: 1,
        user: "prashil",
        password: "codePass123",
        isAdmin: true
    },
    {
        id: 1,
        user: "krish",
        password: "codePass1234",
        isAdmin: false
    }
];

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token =authHeader.split(" ")[1];
        jwt.verify(token, secretKey, (err, user) => {
            if(err) {
                return res.status(403).json("Invalid Token");
            }
            req.user = user;
            next();
        });
    } else {    
        res.status(401).json("Unauthenticated User");
    }
}

const validateAuth = (req, res, next) => {
    const {name, pass} = basicAuth(req);
    req.username = name;
    req.password = pass;
    next();
}

app.post("/api/login", validateAuth, (req, res) =>{
    const {username, password} = req;
    
    const user = users.find(u => {
        return u.user === username && u.password === password;
    })
    if(user){
        // res.json(user)
        //Generate access token
        const accessToken = jwt.sign({id: user.id, isAdmin: user.isAdmin}, secretKey, {expiresIn: "20s"});
        res.json({
            username: user.user,
            isAdmin: user.isAdmin,
            accessToken: accessToken
        })
    } else {
        res.status(401).json("Whacked")
    }
})

app.get('/', (req, res) => {
  res.send('Semantica Email Service!')
})

app.post("/", verify, (req, res) => {
    console.log(req.body);
    res.status(200).json("Email sent");
    // const emailRet = sendEmail('localhost:8000','admin@semantica.co.in');
    // emailRet.then(function(){
    //     res.send("Email sent");
    // }.bind(this))
})

app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})
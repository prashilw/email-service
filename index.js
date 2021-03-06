const express = require('express');
const app = express();
const cors = require('cors');
const basicAuth = require('basic-auth');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || "8000";
const sendEmail = require('./email');

app.use(express.json());

app.use(cors({
    origin: '*'
}));

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

app.options("*", (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Content-Type', 'application/json;charset=UTF-8');
    res.header('Access-Control-Allow-Credentials', true);
    res.sendStatus(204);
})
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
        const accessToken = jwt.sign({id: user.id, isAdmin: user.isAdmin}, secretKey, {expiresIn: "30s"});
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

app.post("/sendEmail", verify, (req, res) => {
    console.log(req.body);
    // res.status(200).send("Email sent");
    const emailRet = sendEmail(req.body,'admin@semantica.co.in');
    emailRet.then(() => {
        res.status(200).send("Email sent");
    }).catch((err) => {
        res.status(500).json("Internal Error")
    })

    // res.status(200).send("Email sent");
    
})

app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})
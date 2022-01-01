const express = require('express');
const app = express();
const port = process.env.PORT || "8000";
const sendEmail = require('./email');

app.get('/', (req, res) => {
  res.send('Semantica Email Service!')
})

app.post("/", (req, res) => {
    console.log(req.body);
    const emailRet = sendEmail('localhost:8000','prashilw@gmail.com');
    emailRet.then(function(){
        res.send("Email sent");
    }.bind(this))
})

app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})
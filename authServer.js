const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')
dotenv.config({path: './config.env'});
const app = express();

const port = process.env.AUTHPORT || 4000 ;
const host = process.env.HOST || '127.0.0.1' ;

app.use(express.json());

let refereshTokens = [];

app.post('/token',(req,res) => {
    const refereshToken = req.body.token ;
    if (refereshToken == null) return res.sendStatus(401);
    if (!refereshTokens.includes(refereshToken)) return res.sendStatus(403);
    jwt.verify(refereshToken,process.env.REFRESH_TOKEN_SECRET,(err,user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({name: user.name});
        res.json({accessToken : accessToken});
    })

})

app.post('/signout',(req,res) => {
    refereshTokens = refereshTokens.filter(refereshToken => refereshToken !== req.body.token ) ;
    res.sendStatus(204);
} )

app.post('/signin',(req,res) => {
    // authentication part
    // authorization part
    const username = req.body.username ;
    if ( username == null) return res.sendStatus(401);
    const user = {name : username};
    const accessToken = generateAccessToken(user);
    const refereshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
    refereshTokens.push(refereshToken);
    res.json({accessToken: accessToken, refereshToken: refereshToken});
})

function generateAccessToken(user) {
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn : '50s'});
}

app.listen(port,host,() => {
    console.log(host);
    console.log(`${port} is running`);
});

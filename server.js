const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const jwt = require('jsonwebtoken');
const app = express();


const port = process.env.PORT || 3000 ;
const host = process.env.HOST || '127.0.0.1' ;

const blogs = [
    {
        username : "jagonmoy",
        title : "blog 1",
    },
    {
        username: "saikot",
        title: "blog 2",
    }
]

app.use(express.json());

app.get('/blogs',authenticateToken,(req,res) => {
    res.json(blogs.filter(blogs => blogs.username == req.user.name));
})

function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if ( token == null) return res.sendStatus(401);
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user) => {
        if(err) return res.sendStatus(403);
        req.user = user ;
        next();
    })
}

app.listen(port,host,() => {
    console.log(host);
    console.log(`${port} is running`);
});

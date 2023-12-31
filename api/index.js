const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User.js');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: '.env' })
// const { cloudinary } = require('./cloudinary/index.js')
const { storage } = require('./cloudinary/index.js')
const upload = multer({ storage })

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

// app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("database connected")
}).catch((err) => {
    console.log(err)
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (e) {
        console.log(e);
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    if (!req.body) return response.json({ 'error': 'error' });
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        // logged in
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        });
    } else {
        res.status(400).json('wrong credentials');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) return res.json({ error: 'error' });
        res.json(info);
    });
});

app.post('/logout', (req, res) => {
    res.cookie('token', 'null').json('ok');
});

app.post('/post', upload.single('file'), async (req, res) => {
    const image = {
        url: req.file.path,
        filename: req.file.filename
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: { ...image },
            author: info.id,
        });
        //console.log(postDoc);
        res.json(postDoc);
    });

});

app.put('/post', upload.single('file'), async (req, res) => {

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('you are not the author');
        }

        let image = postDoc.cover;
        if (req.file) {
            image = {
                url: req.file.path,
                filename: req.file.filename
            }
        }


        var newvalues = { $set: { title, summary, content, cover: image } };
        await Post.updateOne({ title }, newvalues);

        res.json(postDoc);
    });

});

app.get('/post', async (req, res) => {
    const arr = await Post.find()
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .limit(20);

    //console.log(arr);
    res.json(arr)
});

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    //console.log(postDoc);
    res.json(postDoc);
})


app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});


const port = process.env.PORT || 4000;
app.listen(port, () => { console.log(`server Listen at ${port}`) });
//

import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose
.connect('mongodb+srv://admin:12345Aa@cluster0.ytge6vp.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log('DB ok'))
.catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello 1');
});

app.post('/auth/login', (req, res) => {
    console.log(req.body);

    const token = jwt.sign(
    {
        email: req.body.email,
        fullName: 'Pall',
    },
    'secret123',
    );

    res.json({
        success: true,
        token,
    });
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('server ok')
});
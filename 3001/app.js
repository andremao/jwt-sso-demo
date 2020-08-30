const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const SECRET_KEY = fs
  .readFileSync(path.resolve(__dirname, './secret.key'))
  .toString()
  .trim();
console.log(SECRET_KEY, 'SECRET_KEY');

const app = express();

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    req.payload = jwt.verify(token, SECRET_KEY);
    next();
  } catch (e) {
    res.json({ code: 401, msg: 'invalid token' });
  }
};

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './index.html'));
});

app.get('/cross-local-storage', (req, res) => {
  res.sendFile(path.resolve(__dirname, './cross-local-storage.html'));
});

app.post('/login', express.json(), (req, res) => {
  console.log(req.body);
  const token = jwt.sign(req.body, SECRET_KEY, { expiresIn: '30m' });
  res.json({ code: 200, msg: 'ok', token });
});

app.get('/profile', auth, (req, res) => {
  res.json({ code: 200, msg: 'ok', payload: req.payload });
});

app.listen(3001);

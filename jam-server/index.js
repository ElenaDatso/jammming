// import { createServer } from 'node:http';

// config();

// const server = createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешает запросы с любого домена
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Разрешённые методы
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   res.end(JSON.stringify({ message: 'Hello World' }));
// });

// server.listen(3000, () => {
//   console.log('Server running at http://localhost:3000/');
// });

import express from 'express';
import { config } from 'dotenv';
config();
const PORT = 3000;
let curState = '';

const app = express();
app.listen(PORT, () => {
  console.log('server is running...');
});

app.post('/state', (req, res, next) => {
  if (!curState) {
    const query = req.query;
    curState = query.state;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(curState);
  }
});

app.get('/state', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(curState);
});

app.get('/token', (req, res, next) => {
  const query = req.query;
  if (curState === query.state && query.code) {
    console.log('get token!');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.send('get token!');
  } else {
    console.log('error!', curState, query.state, query.code);
  }
});

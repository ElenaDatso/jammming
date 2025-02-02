import express from 'express';
import { config } from 'dotenv';
config();
const PORT = 3000;
let curState = '';
let curCode = '';
let token = '';

const app = express();
app.listen(PORT, () => {
  console.log('server is running...');
});

app.post('/state', (req, res, next) => {
  const query = req.query;
  curState = query.state || curState;
  curCode = query.code || curCode;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send({ curCode, curState });
});

app.get('/state', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send({
    code: curCode,
    state: curState,
  });
});

app.post('/logout', (req, res, next) => {
  curState = '';
  curCode = '';
  token = '';
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.send({
    code: curCode,
    state: curState,
  });
});

app.get('/token', async (req, res, next) => {
  console.log('curCode', curCode);
  if (curState && curCode) {
    await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: new URLSearchParams({
        code: curCode,
        redirect_uri: 'http://localhost:5173/authorized',
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((data) => data.json())
      .then((tokenObj) => {
        token = tokenObj.access_token || token;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(200).send();
      })
      .catch((e) => {
        console.log(e);
        res.status(400).send();
      });
  } else {
    console.log('missing data!');
  }
});

app.get('/search-tracks', async (req, res, next) => {
  const query = req.query.q;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  try {
    const url = new URL('https://api.spotify.com/v1/search');
    url.searchParams.append('q', query);
    url.searchParams.append('type', 'track');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }
    const data = await response.json();
    console.log(data.tracks.items);
    res.send(data.tracks.items);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    res.send([]);
  }
});

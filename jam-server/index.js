import express from 'express';
// import bodyParser from 'body-parser';
import { config } from 'dotenv';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());


config();

const PORT = 3000;
let curState = '';
let curCode = '';
let token = '';
let userId = {};


app.listen(PORT, () => {
  console.log('server is running...');
});
const getUserData = async () => {
  try {
    const userData = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = await userData.json();
    userId = user.id;
    return user;
  } catch (e) {
    console.error('userIf fetching failed:', e);
    return null;
  }
};
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
  if (curState && curCode) {
    try {
      const tokenData = await fetch('https://accounts.spotify.com/api/token', {
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
      });
      const tokenObj = await tokenData.json();
      token = tokenObj.access_token || token;

      const userData = await getUserData();
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.status(200).send(userData);
    } catch (e) {
      console.error(e);
      res.status(400).send();
    }
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

app.post('/add-playlist', async (req, res, next) => {
  console.log('req.body', req.body, req.query.playListName);
  if (!userId) {
    try {
      await getUserData();
    } catch (e) {
      throw Error('No user id!');
    }
  }

  try {
    const playListName = req.query.playListName;
    const playListResp = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playListName,
          description: 'none',
          public: true,
        }),
      }
    );
    const playListData = await playListResp.json();

    if (playListData.id) {
      const reqPlayList = req.body.data;
      try {
        const bodyData = JSON.stringify({
          uris: reqPlayList,
          position: 0,
        });
        const resp = await fetch(
          `https://api.spotify.com/v1/playlists/${playListData.id}/tracks`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: bodyData,
          }
        );
        const respData = await resp.json();
        console.log(respData);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.send(respData);
      } catch (e) {
        console.error(e);
      }
    }
  } catch (e) {
    console.error("couldn't post playlist");
    res.status(400).send();
  }
});

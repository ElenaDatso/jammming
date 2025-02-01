import queryString, { ParsedUrl } from 'query-string';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthProvider';
import { generateRandomString } from './generateRandomString';

const cliendUrl = 'http://localhost:5173/'
const clientId = '1003e460eacc42e9b994dd5e93b70881';
const redirectUri = cliendUrl + 'authorized';
const scope = 'user-read-private user-read-email';
const serverUrl = 'http://localhost:3000/';

const fetchStateAndCode = async () =>
  await fetch(`${serverUrl}state`)
    .then((res) => res.json())
    .then((res) => {
      return res;
    });

const postStateAndCode = async (state?: string, code?: string) => {
  const queryParams = queryString.stringify({
    state: state,
    code: code,
  });
  return await fetch(`${serverUrl}state?${queryParams}`, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((e) => console.log(e));
};

const sendAuthRequest = async () => {
  const state = generateRandomString(16);
  try {
    const postData = await postStateAndCode(state);
    console.log('postData', postData);
    if (postData.curState) {
      const queryParams = queryString.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: postData.curState,
        show_dialog: true,
      });
      const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${queryParams}`;
      window.location.href = spotifyAuthUrl;
    }
  } catch (e) {
    console.log(e);
  }
};

const handleLogOut = async () => {
  try {
    const response = await fetch(`${serverUrl}logout`, {
      method: 'POST',
    });
    if (response.ok) {
      window.location.href = cliendUrl;
      return await response.json();
    }
  } catch (e) {
    console.log(e);
    throw Error;
  }
};

const SpotifyLogin: React.FC = () => {
  const {
    setIfAuthHandler,
    setAccessStatusHandler,
    isAuthorized,
    accessStatus,
  } = useAuthContext();

  const [curState, setState] = useState<null | string>(null);
  const [curUrl, setCurUrl] = useState<ParsedUrl | null>(null);

  useEffect(() => {
    const state = async () => {
      const data = await fetchStateAndCode();
      console.log(data, data.state, data.code);
      setState(data.state);
      if (data.state && data.code) {
        setIfAuthHandler(true);
        setAccessStatusHandler('corfirmed');
      }
    };
    state().catch((e) => console.log(e));
    console.log(isAuthorized, accessStatus);

    const url = queryString.parseUrl(window.location.href);
    setCurUrl(url);
    if (curUrl?.query.code && curUrl?.query.state === curState) {
      setIfAuthHandler(true);
      setAccessStatusHandler('corfirmed');
      console.log(isAuthorized, accessStatus);
      const postedData = async () => {
        const code = curUrl.query.code as string;
        const data = await postStateAndCode(curState || undefined, code);
        console.log(data);
        if (data.curCode && data.curState) {
          console.log(data);
          history.replaceState(null, '', location.pathname);
        }
      };
      postedData().catch((e) => console.log(e));
    }
  }, [curState, isAuthorized]);

  return (
    <>
      {!isAuthorized && (
        <button onClick={() => sendAuthRequest()}>Log in with Spotify</button>
      )}
      {isAuthorized && (
        <button
          onClick={() => {
            handleLogOut();
          }}
        >
          Log Out
        </button>
      )}
    </>
  );
};

export default SpotifyLogin;

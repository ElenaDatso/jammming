import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useAuthContext } from '../context/AuthProvider';
import { generateRandomString } from './generateRandomString';

const cliendUrl = 'http://localhost:5173/';
const clientId = '1003e460eacc42e9b994dd5e93b70881';
const redirectUri = cliendUrl + 'authorized';
const scope =
  'user-read-private user-read-email playlist-modify-private playlist-modify-public';
const serverUrl = 'http://localhost:3000/';

const fetchStateAndCode = async () => {
  try {
    const res = await fetch(`${serverUrl}state`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching state:', error);
    return null;
  }
};

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

const getToken = async () => {
  try {
    const result = await fetch(`${serverUrl}token`);
    if (result.ok) {
      return await result.json()
    } else {
      return false
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
    setUserDataHandler,
  } = useAuthContext();

  useEffect(() => {
  const handleAuthRedirect = async () => {
    const urlParams = queryString.parse(window.location.search);
    const urlCode = urlParams.code as string;
    const urlState = urlParams.state as string;

    if (urlCode && urlState) {
      console.log('User returned from Spotify:', { urlCode, urlState });

      try {
        const serverData = await fetchStateAndCode();
        console.log('Server state:', serverData.state);

        if (serverData.state !== urlState) {
          console.error('State mismatch! Possible security risk.');
          return;
        }

        const postData = await postStateAndCode(urlState, urlCode);
        console.log(postData)

        if (postData?.curCode && postData?.curState) {
          const isTokenAndUser = await getToken();

          if (isTokenAndUser) {
            setIfAuthHandler(true);
            setAccessStatusHandler('corfirmed');
            setUserDataHandler(isTokenAndUser);
          } else {
            console.warn('Failed to get token');
          }
        } else {
          console.warn('Failed to retrieve auth code.');
        }

        history.replaceState(null, '', location.pathname);
      } catch (error) {
        console.error('Error handling Spotify redirect:', error);
      }
    }
  };

  handleAuthRedirect();
  }, []);

  return (
    <>
      {!isAuthorized && (
        <button onClick={() => sendAuthRequest()}>Log in with Spotify</button>
      )}
      {isAuthorized && (
        <button
          onClick={() => {
            setIfAuthHandler(false);
            setAccessStatusHandler('unset');
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

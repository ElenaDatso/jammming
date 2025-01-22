import queryString from "query-string";

const clientId = '1003e460eacc42e9b994dd5e93b70881';
const redirectUri = 'http://localhost:5173/';
const scope = 'user-read-private user-read-email';


function generateRandomString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const SpotifyLogin: React.FC = () => {
  const handleLogin = () => {
    const state = generateRandomString(16);
    const queryParams = queryString.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
    });

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${queryParams}`;
    window.location.href = spotifyAuthUrl; // Перенаправление пользователя
  };
  return <button onClick={handleLogin}>Log in with Spotify</button>;
};

export default SpotifyLogin;
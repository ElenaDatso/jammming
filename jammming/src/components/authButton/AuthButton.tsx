// import queryString, { ParsedUrl } from 'query-string';
// import React, { useEffect, useState } from 'react';
// import { generateRandomString, handleLogin } from '../api/SpotifyLogin';

// function AuthButton() {
//   const serverUrl = 'http://localhost:3000/';
//   const [curState, setCurState] = useState<null | string>(null);
//   const [curUrl, setCurUrl] = useState<ParsedUrl | null>(null);

//   useEffect(() => {
//     const url = queryString.parseUrl(window.location.href);

//     setCurUrl(url);
//     async function fetchState() {
//       const fetchedState = await fetch(`${serverUrl}state`)
//         .then((res) => res.text())
//         .then((res) => {
//           return res;
//         });
//       setCurState(fetchedState);
//       if (curState === null) {
//         const key = generateRandomString(16);
//         const queryParams = queryString.stringify({
//           state: key,
//         });
//         try {
//           await fetch(`${serverUrl}state?${queryParams}`, {
//             method: 'POST',
//           });
//           await handleLogin(key);
//         } catch (e) {
//           console.log(e);
//         }
//       } else {
//         const queryParams = queryString.stringify({
//           state: curState,
//           code: curUrl?.query.code,
//         });
//         fetch(`${serverUrl}token?${queryParams}`, {
//           mode: 'no-cors',
//         });
//       }
//     }
//     fetchState();
//   }, [curState]);
//   return <div>AuthButton</div>;
// }

// export default AuthButton;

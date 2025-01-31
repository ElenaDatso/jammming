import React, { useState, useEffect } from 'react';
import Button from '../button/Button';
import InputField from '../inputField/InputField';
import { generateRandomString, handleLogin } from '../api/auth';
import queryString, { ParsedUrl } from 'query-string';

const serverUrl = 'http://localhost:3000/';

// interface spotifyUrl extends UrlObject {
//   query: {
//     code: string,
//     state: string
//   }
// }

function Searchbar({ className = '' }: { className?: string }) {
  const [searchValue, setSearchValue] = useState('');
  const [clearInput, setClearInput] = useState(false);
  const [curState, setCurState] = useState<null | string>(null);
  const [curUrl, setCurUrl] = useState<ParsedUrl | null>(null);

  useEffect(() => {
    
    const url = queryString.parseUrl(window.location.href);
    
    setCurUrl(url);
    console.log(curUrl?.query);
    async function fetchState() {
      const fetchedState = await fetch(`${serverUrl}state`)
        .then((res) => res.text())
        .then((res) => {
          console.log(res);
          return res;
        });
      console.log(fetchedState);
      setCurState(fetchedState);
      console.log(curState);
      if (curState === null) {
        const key = generateRandomString(16);
        const queryParams = queryString.stringify({
          state: key,
        });
        try {
          await fetch(`${serverUrl}state?${queryParams}`, {
            method: 'POST',
          });
          await handleLogin(key);
        } catch (e) {
          console.log(e);
        }
      } else {
        const queryParams = queryString.stringify({
          state: curState,
          code: curUrl?.query.code,
        });
        fetch(`${serverUrl}token?${queryParams}`, {
          mode: 'no-cors',
        });
      }
    }
    fetchState();
  }, [curState]);

  const onChangeHandler = (inputValue: string) => {
    if (clearInput) setClearInput(false);
    setSearchValue(inputValue);
  };

  async function getData() {
    const queryParams = queryString.stringify({
      state: curState,
      code: curUrl?.query.code || '',
    });
    await fetch(`${serverUrl}token?${queryParams}`, { mode: 'no-cors' });
  }
  return (
    <section className={className}>
      <div className="w-full">
        <InputField
          clearInput={clearInput}
          placeHolder="search something jammming"
          initialInputValue={searchValue}
          getInputValue={onChangeHandler}
        />
      </div>
      <div className="text-center">
        <Button
          cb={() => {
            setClearInput(true);
          }}
        >
          Search
        </Button>
        <Button cb={getData}>Call to server</Button>
      </div>
    </section>
  );
}

export default Searchbar;

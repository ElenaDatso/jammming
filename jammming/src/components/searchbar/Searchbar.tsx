import React, { useState } from 'react';
import Button from '../button/Button';
import InputField from '../inputField/InputField';
import { useTracksContext } from '../context/TracksContext';

const serverUrl = 'http://localhost:3000/';

function Searchbar({ className = '' }: { className?: string }) {
  const { addSearchedList } = useTracksContext();
  const [searchValue, setSearchValue] = useState('');
  const [clearInput, setClearInput] = useState(false);

  const onChangeHandler = (inputValue: string) => {
    if (clearInput) setClearInput(false);
    setSearchValue(inputValue);
  };
  const searchTracks = async (q: string) => {
    const result = await fetch(`${serverUrl}search-tracks?q=${q}`);
    const list  = (await result.json())
    console.log(list)
    addSearchedList(list);
  };

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
            searchTracks(searchValue);
            setClearInput(false);
          }}
        >
          Search
        </Button>
      </div>
    </section>
  );
}

export default Searchbar;

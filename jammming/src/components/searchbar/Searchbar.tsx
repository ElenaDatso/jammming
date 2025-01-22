import React, {useState} from 'react';
import Button from '../button/Button';
import InputField from '../inputField/InputField';

function Searchbar({ className = '' }: { className?: string }) {
  const [searchValue, setSearchValue] = useState('');
  const [clearInput, setClearInput] = useState(false);
  const onChangeHandler = (inputValue: string) => {
    if (clearInput) setClearInput(false);
    setSearchValue(inputValue);
  }
  return (
    <section className={className}>
      <div className="w-full">
        <InputField clearInput={clearInput} placeHolder='search something jammming' initialInputValue={searchValue} getInputValue={onChangeHandler}/>
      </div>
      <div className="text-center">
        <Button cb={() => {
          setClearInput(true);
          }}>Search</Button>
      </div>
    </section>
  );
}

export default Searchbar;

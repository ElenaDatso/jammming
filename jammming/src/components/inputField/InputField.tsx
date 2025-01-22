import React, { useRef, useState, useEffect } from 'react'

function InputField({
  className,
  getInputValue,
  initialInputValue,
  placeHolder = '',
  clearInput
}: {
  className?: string;
  getInputValue: (inputValue: string) => void;
  initialInputValue: string,
  placeHolder?: string,
  clearInput?: boolean
}) {
  const [inputVal, setInpVal] = useState(initialInputValue);

  useEffect(()=> {
    if(clearInput) {
      setInpVal('');
    }
  }, [clearInput])

  const inpRef = useRef<HTMLInputElement | null>(null);
  const onChangeHandler = () => {
    setInpVal(inpRef.current?.value || '');
    getInputValue(inpRef.current?.value || '');
  };
  return (
    <>
      <input
        placeholder={placeHolder}
        onChange={onChangeHandler}
        ref={inpRef}
        className={`w-full rounded-sm leading-[3rem] text-blue-950 px-4 ${className}`}
        value={clearInput ? '' : inputVal}
      />
    </>
  );
}

export default InputField
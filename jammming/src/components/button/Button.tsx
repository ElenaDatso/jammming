import React from 'react'

function Button({children, cb, className = ''}: {children: string | JSX.Element | JSX.Element[], 'cb': () => void, className?: string}) {
  return (
    <button
      className={`min-w-48 rounded-sm px-4 py-2  mt-4 bg-purple-950 ${className}`}
      type="button"
      onClick={cb}
    >
      {children}
    </button>
  );
}

export default Button;

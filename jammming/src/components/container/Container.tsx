import React from 'react'

function Container({children}: {children: string | JSX.Element | JSX.Element[]}) {
  return (
    <div className='w-full rounded-sm bg-indigo-900/90 p-4'>{children}</div>
  )
}

export default Container;

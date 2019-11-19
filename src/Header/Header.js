import React from 'react';

export default function header(props) {
  const {supplierName, userEmail, onLogout} = props;

  return (
    <header>
      <span>{supplierName}</span>
      <span>{userEmail}</span>
      <button className='btn btn-full' onClick={onLogout}>logout</button>
    </header>
  );
}

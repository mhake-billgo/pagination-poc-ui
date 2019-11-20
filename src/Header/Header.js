import React from 'react';
import './header.css';

export default function Header(props) {
  const {supplierName, userEmail, onLogout} = props;

  return (
    <header className='toolbar'>
      <div className='toolbar__user'><span>{supplierName}</span> <span>{userEmail}</span> </div>
      <button className='btn btn-full toolbar__logout' onClick={onLogout}>logout</button>
    </header>
  );
}

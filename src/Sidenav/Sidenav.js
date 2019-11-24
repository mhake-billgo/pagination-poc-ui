import React from 'react';
import { Link } from "@reach/router"
import './Sidenav.css';

export default function Sidenav(props) {

  return (
    <div className='sidenav'>
        <Link to="/payments">Payments</Link>
        <Link to="/info">Info</Link>
    </div>
  );
}

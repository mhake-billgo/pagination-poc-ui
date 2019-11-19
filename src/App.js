import React from 'react';
import './App.css';

function App(props) {
  const {handleLogout} = props;
  return (
    <div className="app">
      <header>
        <a className='btn btn-full' href='#' onClick={handleLogout}>logout</a>
      </header>
      <section>
        section
      </section>
    </div>
  );
}

export default App;

import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import './App.css';


const CURRENT_USER = gql`
    {
        currentUser {
            ... on SupplierUser {
                id
                enabledFeatures
                email
                firstName
                lastName
                role
            }
        }
    }
`;

function App(props) {
  const {handleLogout} = props;
  const { loading, error, data } = useQuery(CURRENT_USER);
  console.log('loading, error, data: ',loading,error, data);

  return (
    <div className="app">
      <header>
        <button className='btn btn-full' onClick={handleLogout}>logout</button>
      </header>
      <section>
        section
      </section>
    </div>
  );
}

export default App;

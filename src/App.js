import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Header from './Header';
import Payments from './Payments';
import './App.css';


const CURRENT_USER = gql`
    {
        currentUser {
            ... on SupplierUser {
                id
                email
                firstName
                lastName
                role
                suppliers {
                    id
                    legalName
                }
            }
        }
    }
`;

function App(props) {
  const {handleLogout} = props;
  const { loading, error, data } = useQuery(CURRENT_USER);
  console.log('loading, error, data: ',loading,error, data);

  const userEmail = data ? data.currentUser.email : '';
  const supplierName = data ? data.currentUser.suppliers[0].legalName : '';
  const supplierId = data ? data.currentUser.suppliers[0].id : undefined;

  return (
    <div className="app">
      <Header onLogout={handleLogout} supplierName={supplierName} userEmail={userEmail}/>
      {supplierId &&
        <Payments supplierId={supplierId}/>
      }

    </div>
  );
}

export default App;

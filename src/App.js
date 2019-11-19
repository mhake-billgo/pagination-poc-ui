import React, {useEffect} from 'react';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import './App.css';

function App(props) {
  const {handleLogout, jwtToken} = props;

  useEffect(() => {
    if(jwtToken) {
      console.log("Have JWT and running GQL");

      const httpLink = createHttpLink({
        uri: 'https://www.uncheck.billgo-dev.com/graphql',
      });

      const authLink = setContext((_, { headers }) => {
        return {
          headers: {
            ...headers,
            Authorization: jwtToken ? jwtToken : "",
          }
        }
      });
      const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
      });

      client.query({
        query: gql`
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
        `
      }).then(result => console.log(result));
    }
  }, [jwtToken]);

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

import React, { Component } from 'react';
import {Auth} from "aws-amplify";
import Amplify from "aws-amplify";
import { ConfirmSignIn, ForgotPassword, RequireNewPassword, SignIn, VerifyContact, withAuthenticator } from 'aws-amplify-react';
import App from './App';
import {createHttpLink} from "apollo-link-http";
import {setContext} from "apollo-link-context";
import {ApolloClient} from "apollo-client";
import {InMemoryCache} from "apollo-cache-inmemory";
import { ApolloProvider } from '@apollo/react-hooks';
import introspectionQueryResultData from './fragmentTypes.json';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';


Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID,
   }
});

class AuthenticatedApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      apolloClient:undefined
    };
  }

  componentDidMount() {
    /**
     * Set up a listener on the AWS Auth object. Once a cognito session is established
     * then initialize an Apollo Client using the Cognito JWT token
     */
    Auth.currentSession()
      .then(session => {
        console.log('Auth session established. Initializing Apollo client...');

        const httpLink = createHttpLink({
          uri: 'https://www.uncheck.billgo-dev.com/graphql',
        });

        const authLink = setContext((_, { headers }) => {
          return {
            headers: {
              ...headers,
              authorization: session.idToken.jwtToken,
            }
          }
        });

        const fragmentMatcher = new IntrospectionFragmentMatcher({
          introspectionQueryResultData
        });

        const cache = new InMemoryCache({ fragmentMatcher });

        const client = new ApolloClient({
          link: authLink.concat(httpLink),
          cache: cache,
          defaultOptions: {
            watchQuery: {
              fetchPolicy: 'cache-first',
              notifyOnNetworkStatusChange: true
            },
          },
        });

        // Save the client to the state
        this.setState({
          apolloClient: client
        });
      }).catch(err => console.log(err));
  }

  handleLogout = async event => {
    console.log("Logging out");
    const { apolloClient } = this.state;
    if(apolloClient) {
      console.log('Resetting Apollo Client store');
      await apolloClient.resetStore();
    }
    await Auth.signOut();
  };

  render() {
    const { apolloClient } = this.state;

    if(!apolloClient) {
      console.log('apolloClient not initialized yet, not rendering app');
      // Return null to prevent rendering, until we have a valid login and valid Apollo Client
      return null;
    }

    return (
      <ApolloProvider client={apolloClient}>
        <App handleLogout={this.handleLogout}/>
      </ApolloProvider>
    );
  }
}

export default withAuthenticator(AuthenticatedApp, {
  includeGreetings: false,
  authenticatorComponents: [
    <SignIn/>,
    <ConfirmSignIn/>,
    <VerifyContact/>,
    <ForgotPassword/>,
    <RequireNewPassword />
  ]
});

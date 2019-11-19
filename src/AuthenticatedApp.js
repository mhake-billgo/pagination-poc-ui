import React, { Component } from 'react';
import {Auth} from "aws-amplify";
import Amplify from "aws-amplify";
import { ConfirmSignIn, ForgotPassword, RequireNewPassword, SignIn, VerifyContact, withAuthenticator } from 'aws-amplify-react';
import App from './App';

const GRAPHQL_URL = '/graphql';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID,
  },
  API: {
    // Note the API configuration adds `graphql_endpoint_iam_region`. This is to
    // sign requests that are passing through API gateway as documented here:
    // https://aws-amplify.github.io/docs/js/api#set-custom-request-headers-for-graphql
    // It appears that we can either do this, or set the Authorization header explicitly
    // via the `graphql_headers` property. Dont know which is preferred.
    graphql_headers: async () => {
      return Auth.currentSession()
        .then(session => {
          return { 'Authorization': session.idToken.jwtToken}
        }).catch(err => console.log(err));
    },
    graphql_endpoint: GRAPHQL_URL,
  }
});

class AuthenticatedApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      jwtToken:''
    };
  }

  componentDidMount() {
    Auth.currentSession()
      .then(session => {
        console.log('Auth.currentSession():', session);
        this.setState({
          jwtToken: session.idToken.jwtToken
        });
      }).catch(err => console.log(err));
    Auth.currentUserInfo().then(user => {
      console.log('Auth.currentUserInfo():', user);
    }).catch(err => {
      console.log('Auth error:', err);
    });
  }

  handleLogout = async event => {
    console.log("Logging out");
    await Auth.signOut();
  };

  render() {
    const { jwtToken } = this.state;
    return (
      <App handleLogout={this.handleLogout} jwtToken={jwtToken} />
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
